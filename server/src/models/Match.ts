

import { Schema, model, Types } from 'mongoose';

export interface IMatch {
  players: Types.ObjectId[]; // reference to User IDs
  mode: 'normal' | 'expert' | 'master';
  winner: Types.ObjectId | null;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  players: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  mode: { type: String, enum: ['normal', 'expert', 'master'], required: true },
  winner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Match = model<IMatch>('Match', MatchSchema);
