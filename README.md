# LaTeX Typing Test

A modern typing test application focused on LaTeX mathematical expressions, inspired by Monkeytype.

## Features

- 🧮 **LaTeX Math Typing**: Practice typing mathematical equations and expressions
- 📊 **Multiple Categories**: Algebra, Calculus, Geometry, Statistics, and more
- 🎯 **Difficulty Levels**: Easy, Medium, and Hard equations
- 📈 **Detailed Statistics**: WPM, accuracy, consistency tracking
- 🎨 **Modern UI**: Clean, responsive design with theme support
- 🏃 **Practice Mode**: Character-by-character feedback for learning
- ⏱️ **Flexible Tests**: 10, 50, or 100 equation challenges

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Math Rendering**: KaTeX
- **Animations**: Framer Motion
- **Database**: MongoDB/PostgreSQL (optional)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/latex-typing-test.git
cd latex-typing-test
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Start the development servers:

Frontend:
```bash
cd client
npm start
```

Backend:
```bash
cd server
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1. **Select Categories**: Choose which types of mathematical expressions to practice
2. **Choose Difficulty**: Pick Easy, Medium, or Hard equations
3. **Select Mode**: 
   - **Normal**: Type the LaTeX code to match the rendered equation
   - **Practice**: See character-by-character feedback as you type
4. **Set Test Length**: Choose 10, 50, or 100 equations
5. **Start Typing**: Press any key to begin, Enter to submit answers
6. **View Results**: See your WPM, accuracy, and detailed statistics

## Keyboard Shortcuts

- **Any key**: Start test
- **Tab**: Quick restart (when enabled)
- **Enter**: Submit answer
- **Hold Enter**: Skip equation (1 second)
- **Esc**: Open settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by [Monkeytype](https://monkeytype.com/)
- Math rendering powered by [KaTeX](https://katex.org/)
