import type { GameState } from '../types/game';

const API_URL = 'http://localhost:3001/api';

export interface InvoiceResponse {
  gameId: string;
  invoice: string;
  amountSats: number;
  memo: string;
}

export interface InvoiceStatus {
  isPaid: boolean;
  playerCredits: number;
}

export interface BegResponse {
  game: GameState;
  playerCredits: number;
}

export const api = {
  async getGame(): Promise<GameState> {
    const response = await fetch(`${API_URL}/game`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch game');
    }
    
    return response.json();
  },

  async nextRound(): Promise<GameState> {
    const response = await fetch(`${API_URL}/game/next-round`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to advance round');
    }
    
    return response.json();
  },

  async respondToBeg(botId: string, approved: boolean, comment: string): Promise<BegResponse> {
    const response = await fetch(`${API_URL}/game/beg-response`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botId, approved, comment }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to respond to beg request');
    }
    
    return response.json();
  },

  async resetGame(): Promise<GameState> {
    const response = await fetch(`${API_URL}/game/reset`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset game');
    }
    
    return response.json();
  },

  async createInvoice(): Promise<InvoiceResponse> {
    const response = await fetch(`${API_URL}/game/create-invoice`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    
    return response.json();
  },

  async checkInvoiceStatus(): Promise<InvoiceStatus> {
    const response = await fetch(`${API_URL}/game/invoice-status`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to check invoice status');
    }
    
    return response.json();
  },
};