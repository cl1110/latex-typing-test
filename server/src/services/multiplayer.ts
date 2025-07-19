import { Server, Socket } from 'socket.io';
import { User } from '../models/User';
import { Match } from '../models/Match';
import { calculateNewRating } from '../utils/rating';
import { Equation } from '../models/Equations';


interface Player {
  id: string;
  socket: Socket;
  userId: string;
  username: string;
  rating: number;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTime?: number;
}

interface GameRoom {
  id: string;
  players: Player[];
  equations: any[];
  status: 'waiting' | 'countdown' | 'playing' | 'finished';
  startTime?: number;
  mode: 'sprint' | 'time';
  settings: {
    equationCount?: number;
    timeLimit?: number;
  };
}

class MultiplayerService {
  private io: Server;
  private matchmakingQueue: Player[] = [];
  private activeRooms: Map<string, GameRoom> = new Map();
  private playerSocketMap: Map<string, Player> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  setupListeners(socket: Socket) {
  
    socket.on('queue:join', async (data) => {
      const { userId, mode } = data;
      
      try {
        const user = await User.findById(userId);
        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

       
        if (user.level < 5) {
          socket.emit('error', { message: 'You need to be level 5 to play ranked matches' });
          return;
        }

        const player: Player = {
          id: socket.id,
          socket,
          userId: user._id.toString(),
          username: user.username,
          rating: user.multiplayer.rating,
          progress: 0,
          wpm: 0,
          accuracy: 0,
          finished: false
        };

        this.playerSocketMap.set(socket.id, player);
        this.matchmakingQueue.push(player);
        socket.emit('queue:joined');

        
        this.findMatch(player, mode);
      } catch (error) {
        console.error('Error joining queue:', error);
        socket.emit('error', { message: 'Failed to join queue' });
      }
    });

 
    socket.on('queue:leave', () => {
      this.removeFromQueue(socket.id);
      socket.emit('queue:left');
    });


    socket.on('game:progress', (data) => {
      const player = this.playerSocketMap.get(socket.id);
      if (!player) return;

      const room = this.findPlayerRoom(socket.id);
      if (!room || room.status !== 'playing') return;

   
      player.progress = data.progress;
      player.wpm = data.wpm;
      player.accuracy = data.accuracy;


      const opponent = room.players.find(p => p.id !== socket.id);
      if (opponent) {
        opponent.socket.emit('opponent:progress', {
          progress: player.progress,
          wpm: player.wpm,
          accuracy: player.accuracy
        });
      }

     
      if (room.mode === 'sprint' && data.progress >= room.settings.equationCount!) {
        this.handlePlayerFinish(socket.id, room.id);
      }
    });

    socket.on('game:finish', () => {
      const room = this.findPlayerRoom(socket.id);
      if (room) {
        this.handlePlayerFinish(socket.id, room.id);
      }
    });


    socket.on('rematch:request', () => {
      const room = this.findPlayerRoom(socket.id);
      if (!room || room.status !== 'finished') return;

      const player = room.players.find(p => p.id === socket.id);
      const opponent = room.players.find(p => p.id !== socket.id);

      if (player && opponent) {
        opponent.socket.emit('rematch:requested', { from: player.username });
      }
    });

    socket.on('rematch:accept', () => {
      const room = this.findPlayerRoom(socket.id);
      if (!room) return;

  
      this.createRematch(room);
    });


    socket.on('disconnect', () => {
      this.handleDisconnect(socket.id);
    });
  }

  private async findMatch(player: Player, mode: 'sprint' | 'time') {
   
    const ratingRange = 200;
    const compatiblePlayers = this.matchmakingQueue.filter(p => 
      p.id !== player.id &&
      Math.abs(p.rating - player.rating) <= ratingRange
    );

    if (compatiblePlayers.length > 0) {
      const opponent = compatiblePlayers[0];
      
     
      this.removeFromQueue(player.id);
      this.removeFromQueue(opponent.id);

   
      await this.createGameRoom([player, opponent], mode);
    } else {
    
      player.socket.emit('queue:waiting', { 
        position: this.matchmakingQueue.length,
        estimatedTime: this.matchmakingQueue.length * 10 // rough estimate
      });
    }
  }

  private async createGameRoom(players: Player[], mode: 'sprint' | 'time') {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
 
    const equations = await this.getMatchEquations(mode);
    
    const room: GameRoom = {
      id: roomId,
      players,
      equations,
      status: 'waiting',
      mode,
      settings: mode === 'sprint' 
        ? { equationCount: 20 }
        : { timeLimit: 60 }
    };

    this.activeRooms.set(roomId, room);

   
    players.forEach(player => {
      player.socket.join(roomId);
    });


    this.io.to(roomId).emit('match:found', {
      roomId,
      mode,
      equations,
      players: players.map(p => ({
        username: p.username,
        rating: p.rating
      })),
      settings: room.settings
    });


    setTimeout(() => this.startCountdown(roomId), 2000);
  }

  private startCountdown(roomId: string) {
    const room = this.activeRooms.get(roomId);
    if (!room || room.status !== 'waiting') return;

    room.status = 'countdown';
    let count = 3;

    const interval = setInterval(() => {
      this.io.to(roomId).emit('countdown', count);
      count--;

      if (count < 0) {
        clearInterval(interval);
        this.startGame(roomId);
      }
    }, 1000);
  }

  private startGame(roomId: string) {
    const room = this.activeRooms.get(roomId);
    if (!room) return;

    room.status = 'playing';
    room.startTime = Date.now();

    this.io.to(roomId).emit('game:start');

  
    if (room.mode === 'time' && room.settings.timeLimit) {
      setTimeout(() => {
        this.endGame(roomId);
      }, room.settings.timeLimit * 1000);
    }
  }

  private handlePlayerFinish(socketId: string, roomId: string) {
    const room = this.activeRooms.get(roomId);
    if (!room || room.status !== 'playing') return;

    const player = room.players.find(p => p.id === socketId);
    if (!player || player.finished) return;

    player.finished = true;
    player.finishTime = Date.now() - room.startTime!;

 
    const allFinished = room.players.every(p => p.finished);
    const isSprintWinner = room.mode === 'sprint' && player.finished;

    if (allFinished || isSprintWinner) {
      this.endGame(roomId);
    }
  }

  private async endGame(roomId: string) {
    const room = this.activeRooms.get(roomId);
    if (!room || room.status === 'finished') return;

    room.status = 'finished';


    let winner: Player | null = null;
    let loser: Player | null = null;

    if (room.mode === 'sprint') {
     
      winner = room.players.find(p => p.finished) || null;
      loser = room.players.find(p => !p.finished) || null;
    } else {
 
      const [p1, p2] = room.players;
      if (p1.wpm > p2.wpm) {
        winner = p1;
        loser = p2;
      } else if (p2.wpm > p1.wpm) {
        winner = p2;
        loser = p1;
      }
   
    }

  
    if (winner && loser) {
      const newWinnerRating = calculateNewRating(
        winner.rating,
        loser.rating,
        true
      );
      const newLoserRating = calculateNewRating(
        loser.rating,
        winner.rating,
        false
      );

     
      await this.updatePlayerStats(winner, loser, newWinnerRating, newLoserRating);

      
      this.io.to(roomId).emit('game:end', {
        winner: {
          username: winner.username,
          wpm: winner.wpm,
          accuracy: winner.accuracy,
          ratingChange: newWinnerRating - winner.rating,
          newRating: newWinnerRating
        },
        loser: {
          username: loser.username,
          wpm: loser.wpm,
          accuracy: loser.accuracy,
          ratingChange: newLoserRating - loser.rating,
          newRating: newLoserRating
        }
      });
    } else {
    
      this.io.to(roomId).emit('game:end', { tie: true });
    }

  
    await this.saveMatch(room, winner, loser);
  }

  private async updatePlayerStats(
    winner: Player,
    loser: Player,
    newWinnerRating: number,
    newLoserRating: number
  ) {
    
    await User.findByIdAndUpdate(winner.userId, {
      $inc: {
        'multiplayer.gamesPlayed': 1,
        'multiplayer.wins': 1,
        'multiplayer.streak': 1
      },
      $set: {
        'multiplayer.rating': newWinnerRating
      }
    });

 
    await User.findByIdAndUpdate(loser.userId, {
      $inc: {
        'multiplayer.gamesPlayed': 1,
        'multiplayer.losses': 1
      },
      $set: {
        'multiplayer.rating': newLoserRating,
        'multiplayer.streak': 0
      }
    });
  }

  private async saveMatch(room: GameRoom, winner: Player | null, loser: Player | null) {
    const matchData = {
      players: room.players.map(p => ({
        userId: p.userId,
        username: p.username,
        rating: p.rating,
        wpm: p.wpm,
        accuracy: p.accuracy,
        finished: p.finished,
        finishTime: p.finishTime
      })),
      winnerId: winner?.userId,
      mode: room.mode,
      equations: room.equations.map(eq => eq.id),
      duration: Date.now() - room.startTime!,
      timestamp: new Date()
    };

    await Match.create(matchData);
  }

  private async getMatchEquations(mode: 'sprint' | 'time') {
   
    const count = mode === 'sprint' ? 20 : 30;
    const equations = await Equation.aggregate([
      { $match: { active: true } },
      { $sample: { size: count } }
    ]);

    return equations;
  }

  private createRematch(oldRoom: GameRoom) {
  
    oldRoom.players.forEach(p => {
      p.progress = 0;
      p.wpm = 0;
      p.accuracy = 0;
      p.finished = false;
      p.finishTime = undefined;
    });

  
    this.createGameRoom(oldRoom.players, oldRoom.mode);
  }

  private removeFromQueue(socketId: string) {
    this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== socketId);
  }

  private findPlayerRoom(socketId: string): GameRoom | undefined {
    for (const [_, room] of this.activeRooms) {
      if (room.players.some(p => p.id === socketId)) {
        return room;
      }
    }
    return undefined;
  }

  private handleDisconnect(socketId: string) {

    this.removeFromQueue(socketId);
    

    const room = this.findPlayerRoom(socketId);
    if (room && room.status === 'playing') {
    
      const player = room.players.find(p => p.id === socketId);
      const opponent = room.players.find(p => p.id !== socketId);
      
      if (player && opponent) {
        opponent.socket.emit('opponent:disconnected');
     
        this.endGame(room.id);
      }
    }

   
    this.playerSocketMap.delete(socketId);
  }
}

export function setupMultiplayer(io: Server) {
  const multiplayerService = new MultiplayerService(io);

  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    multiplayerService.setupListeners(socket);
  });
}