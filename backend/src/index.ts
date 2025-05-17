import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GameState, SessionData, InvoiceData } from './types';
import { GameManager } from './services/GameManager';
import { sparkService } from './services/SparkService';

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
    invoiceId?: string;
    invoicePaid?: boolean;
    playerCredits?: number;
  }
}

// Routes
app.post('/api/game/create-invoice', async (req, res) => {
  const session = req.session as SessionData;
  const { topUp } = req.body;
  
  try {
    let gameId: string;
    
    if (topUp && session.gameId && session.invoicePaid) {
      // Top-up for existing game
      gameId = session.gameId;
    } else {
      // Create a new game
      const newGame = gameManager.createGame();
      session.gameId = newGame.id;
      gameId = newGame.id;
    }
    
    // Create Lightning invoice for top-up amount
    const amountSats = topUp ? 50 : 150;
    const memo = topUp 
      ? `Top-up credits for game ${gameId}` 
      : `Game credits for game ${gameId}`;
    
    const invoice = await sparkService.createGameInvoice(gameId, amountSats, memo);
    session.invoiceId = invoice.id;
    
    // For new games, reset credits and payment status
    if (!topUp) {
      session.invoicePaid = false;
      session.playerCredits = 0;
    }
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });
    
    res.json({ 
      gameId,
      invoice: invoice.invoice,
      amountSats: invoice.amountSats,
      memo: invoice.memo
    });
  } catch (error) {
    console.error('Failed to create invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.get('/api/game/invoice-status', async (req, res) => {
  const session = req.session as SessionData;
  
  if (!session.invoiceId) {
    return res.status(400).json({ error: 'No active invoice' });
  }
  
  try {
    const isPaid = await sparkService.checkInvoiceStatus(session.invoiceId);
    
    // Check invoice details to determine if this is a new payment
    const currentInvoiceDetails = await sparkService.getInvoiceDetails(session.invoiceId);
    
    if (isPaid) {
      if (!session.invoicePaid) {
        // Initial payment
        session.invoicePaid = true;
        if (currentInvoiceDetails.amountSats === 150) {
          session.playerCredits = 50; // Initial game: pay 150, get 50 credits
        }
      } else if (currentInvoiceDetails.amountSats === 50 && !sparkService.isInvoiceProcessed(session.invoiceId)) {
        // Top-up payment (only process once)
        session.playerCredits = (session.playerCredits || 0) + 50;
        sparkService.markInvoiceAsProcessed(session.invoiceId);
      }
      
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
      });
    }
    
    res.json({ 
      isPaid,
      playerCredits: session.playerCredits || 0
    });
  } catch (error) {
    console.error('Failed to check invoice status:', error);
    res.status(500).json({ error: 'Failed to check invoice status' });
  }
});

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

app.post('/api/game/next-round', async (req, res) => {
  const session = req.session as SessionData;
  
  if (!session.gameId) {
    return res.status(400).json({ error: 'No active game session' });
  }
  
  try {
    const game = await gameManager.processNextRound(session.gameId, session.playerCredits);
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
  
  // Check if approving and if user has sufficient credits
  if (approved) {
    const game = gameManager.getGame(session.gameId);
    if (!game) {
      return res.status(400).json({ error: 'Game not found' });
    }
    
    const begRequest = game.pendingBegRequests.find(req => req.botId === botId);
    if (!begRequest) {
      return res.status(400).json({ error: 'No pending beg request for this bot' });
    }
    
    if (!session.playerCredits || session.playerCredits < begRequest.amount) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }
    
    // Deduct credits from player
    session.playerCredits -= begRequest.amount;
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });
  }
  
  try {
    const game = gameManager.handleBegResponse(session.gameId, botId, approved, comment);
    res.json({ game, playerCredits: session.playerCredits || 0 });
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