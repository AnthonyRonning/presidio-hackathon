export type ActionType = 'HighFive' | 'Block' | 'Attack' | 'DoNothing' | 'Beg' | 'Replicate';

export interface Bot {
  id: string;
  name: string;
  sats: number;
  isAlive: boolean;
  teamId: string;
  consecutiveDoNothing: number;
}

export interface Team {
  id: string;
  name: string;
  bots: Bot[];
}

export interface GameAction {
  botId: string;
  action: ActionType;
  target?: string;
  amount?: number;  // For beg action
  reason?: string;  // For beg action
}

export interface RoundResult {
  actions: GameAction[];  // What bots intended to do
  observedActions?: GameAction[];  // What others saw (for missed HighFives)
  satChanges: { [botId: string]: number };
  newBots?: Bot[];
  eliminatedBots?: string[];
  begRequests?: {
    botId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  begRequest?: {  // Single beg request result for history
    botId: string;
    amount: number;
    reason: string;
    approved?: boolean;
    comment?: string;
  };
}

export interface GameState {
  id: string;
  teams: Team[];
  currentRound: number;
  maxRounds: number;
  isGameOver: boolean;
  winner?: string;
  winCondition?: 'replication' | 'maxRounds';
  history: RoundResult[];
  pendingBegRequests: {
    botId: string;
    amount: number;
    reason: string;
  }[];
}

export interface SessionData {
  gameId?: string;
}

export interface GameHistory extends RoundResult {
  round: number;
  begRequest?: {
    botId: string;
    amount: number;
    reason: string;
    approved?: boolean;
    comment?: string;
  };
}