import type { GameState } from '../types/game';

const API_URL = 'http://localhost:3001/api';

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

  async respondToBeg(botId: string, approved: boolean, comment: string): Promise<GameState> {
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
};