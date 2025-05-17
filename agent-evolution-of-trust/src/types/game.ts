export type Action = 'HighFive' | 'Block' | 'Attack' | 'DoNothing' | 'Beg' | 'Replicate';

export interface Bot {
  id: string;
  name: string;
  sats: number;
  initialSats: number;
  isAlive: boolean;
  teamId: string;
  history: ActionHistory[];
}

export interface ActionHistory {
  round: number;
  action: Action;
  result: number;
}

export interface GameState {
  round: number;
  maxRounds: number;
  bots: Bot[];
  gameStatus: 'waiting' | 'active' | 'ended';
  winner: string | null;
}

export interface BegRequest {
  botId: string;
  amount: number;
  reason: string;
}

export interface BegResponse {
  accepted: boolean;
  amount: number;
  reason: string;
}