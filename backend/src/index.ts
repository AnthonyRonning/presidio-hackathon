import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GameState, SessionData } from './types';
import { GameManager } from './services/GameManager';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize game manager
const gameManager = new GameManager();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // You can add more allowed origins here
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'development-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to false for development
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

// Type declaration for session
declare module 'express-session' {
  interface SessionData {
    gameId?: string;
  }
}

// Routes
app.get('/api/game', (req, res) => {
  const session = req.session as SessionData;
  
  // If no game exists in session, create a new one
  if (!session.gameId) {
    const newGame = gameManager.createGame();
    session.gameId = newGame.id;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });
  }
  
  const game = gameManager.getGame(session.gameId);
  if (!game) {
    const newGame = gameManager.createGame();
    session.gameId = newGame.id;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });
    res.json(newGame);
  } else {
    res.json(game);
  }
});

app.post('/api/game/next-round', (req, res) => {
  const session = req.session as SessionData;
  
  if (!session.gameId) {
    return res.status(400).json({ error: 'No active game session' });
  }
  
  try {
    const game = gameManager.processNextRound(session.gameId);
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/game/beg-response', (req, res) => {
  const session = req.session as SessionData;
  const { botId, approved, comment } = req.body;
  
  if (!session.gameId) {
    return res.status(400).json({ error: 'No active game session' });
  }
  
  try {
    const game = gameManager.handleBegResponse(session.gameId, botId, approved, comment);
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/game/reset', (req, res) => {
  const session = req.session as SessionData;
  const newGame = gameManager.createGame();
  session.gameId = newGame.id;
  res.json(newGame);
});

const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});