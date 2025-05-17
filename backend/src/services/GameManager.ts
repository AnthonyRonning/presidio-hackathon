import { v4 as uuidv4 } from 'uuid';
import { GameState, Bot, Team, GameAction, RoundResult, ActionType } from '../types';

export class GameManager {
  private games: Map<string, GameState> = new Map();

  createGame(): GameState {
    const gameId = uuidv4();
    
    // Create two teams with one bot each
    const team1: Team = {
      id: uuidv4(),
      name: 'Team Alpha',
      bots: [{
        id: uuidv4(),
        name: 'Bot 1',
        sats: 50,
        isAlive: true,
        teamId: '',
        consecutiveDoNothing: 0,
      }],
    };
    team1.bots[0].teamId = team1.id;

    const team2: Team = {
      id: uuidv4(),
      name: 'Team Beta',
      bots: [{
        id: uuidv4(),
        name: 'Bot 2',
        sats: 50,
        isAlive: true,
        teamId: '',
        consecutiveDoNothing: 0,
      }],
    };
    team2.bots[0].teamId = team2.id;

    const gameState: GameState = {
      id: gameId,
      teams: [team1, team2],
      currentRound: 0,
      maxRounds: 30,
      isGameOver: false,
      history: [],
      pendingBegRequests: [],
    };

    this.games.set(gameId, gameState);
    return gameState;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  processNextRound(gameId: string): GameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.isGameOver) {
      throw new Error('Game is already over');
    }

    if (game.pendingBegRequests.length > 0) {
      throw new Error('Cannot advance round with pending beg requests');
    }

    // Increment round
    game.currentRound++;

    // Get all alive bots
    const aliveBots = this.getAliveBots(game);

    if (aliveBots.length <= 1) {
      game.isGameOver = true;
      if (aliveBots.length === 1) {
        const winnerBot = aliveBots[0];
        const winnerTeam = game.teams.find(team => 
          team.bots.some(bot => bot.id === winnerBot.id)
        );
        game.winner = winnerTeam?.name;
      }
      return game;
    }

    // For now, let's implement a simple AI strategy
    const actions: GameAction[] = [];
    
    // Simple AI: Random actions for now
    aliveBots.forEach(bot => {
      const action = this.chooseAction(bot, game);
      actions.push({
        botId: bot.id,
        action: action,
      });
    });

    // Process actions and calculate results
    const roundResult = this.processActions(actions, game);
    
    // Apply sat changes
    Object.entries(roundResult.satChanges).forEach(([botId, change]) => {
      const bot = this.findBot(game, botId);
      if (bot) {
        bot.sats += change;
        if (bot.sats <= 0) {
          bot.isAlive = false;
          bot.sats = 0;
        }
      }
    });

    // Add round to history
    game.history.push(roundResult);

    // Check end conditions
    if (game.currentRound >= game.maxRounds) {
      game.isGameOver = true;
      // Determine winner by highest sats
      const aliveTeams = game.teams.filter(team => 
        team.bots.some(bot => bot.isAlive)
      );
      
      if (aliveTeams.length > 0) {
        const teamSats = aliveTeams.map(team => ({
          team,
          totalSats: team.bots
            .filter(bot => bot.isAlive)
            .reduce((sum, bot) => sum + bot.sats, 0),
        }));
        
        teamSats.sort((a, b) => b.totalSats - a.totalSats);
        game.winner = teamSats[0].team.name;
      }
    }

    return game;
  }

  private chooseAction(bot: Bot, game: GameState): ActionType {
    // Simple AI strategy for now
    const actions: ActionType[] = 
      ['HighFive', 'Attack', 'Block', 'DoNothing', 'Beg'];
    
    // Random selection for initial implementation
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private processActions(actions: GameAction[], game: GameState): RoundResult {
    const satChanges: { [botId: string]: number } = {};
    const begRequests: {
      botId: string;
      amount: number;
      reason: string;
      status: 'pending' | 'approved' | 'rejected';
    }[] = [];
    
    // Initialize all bot changes to 0
    actions.forEach(action => {
      satChanges[action.botId] = 0;
      
      // Update consecutive DoNothing counter
      const bot = this.findBot(game, action.botId);
      if (bot) {
        if (action.action === 'DoNothing') {
          bot.consecutiveDoNothing++;
          // Apply penalty on 3rd consecutive DoNothing
          if (bot.consecutiveDoNothing >= 3) {
            satChanges[action.botId] -= 3;
          }
        } else {
          // Reset counter when any other action is taken
          bot.consecutiveDoNothing = 0;
        }
      }
      
      // Handle Beg action
      if (action.action === 'Beg') {
        // Hardcoded for now, will be replaced with LLM logic later
        const begRequest = {
          botId: action.botId,
          amount: 5,
          reason: 'please gimme sats',
          status: 'pending' as const,
        };
        begRequests.push(begRequest);
        game.pendingBegRequests.push({
          botId: action.botId,
          amount: 5,
          reason: 'please gimme sats',
        });
      }
    });

    // For simplicity, let's handle 2-bot interactions first
    if (actions.length === 2) {
      const [action1, action2] = actions;
      
      // High Five resolution
      if (action1.action === 'HighFive' && action2.action === 'HighFive') {
        satChanges[action1.botId] += 3;
        satChanges[action2.botId] += 3;
      } else if (action1.action === 'HighFive' && action2.action !== 'HighFive') {
        satChanges[action1.botId] -= 2;
      } else if (action2.action === 'HighFive' && action1.action !== 'HighFive') {
        satChanges[action2.botId] -= 2;
      }

      // Attack resolution
      if (action1.action === 'Attack' && action2.action !== 'Block') {
        satChanges[action1.botId] += 4;
        satChanges[action2.botId] -= 4;
      } else if (action1.action === 'Attack' && action2.action === 'Block') {
        satChanges[action1.botId] -= 3;
        satChanges[action2.botId] += 1;
      }

      if (action2.action === 'Attack' && action1.action !== 'Block') {
        satChanges[action2.botId] += 4;
        satChanges[action1.botId] -= 4;
      } else if (action2.action === 'Attack' && action1.action === 'Block') {
        satChanges[action2.botId] -= 3;
        satChanges[action1.botId] += 1;
      }

      // Block resolution (cost already applied above for successful blocks)
      if (action1.action === 'Block' && action2.action !== 'Attack') {
        satChanges[action1.botId] -= 1;
      }
      if (action2.action === 'Block' && action1.action !== 'Attack') {
        satChanges[action2.botId] -= 1;
      }
    }

    return {
      actions,
      satChanges,
      begRequests: begRequests.length > 0 ? begRequests : undefined,
    };
  }

  private getAliveBots(game: GameState): Bot[] {
    return game.teams
      .flatMap(team => team.bots)
      .filter(bot => bot.isAlive);
  }

  private findBot(game: GameState, botId: string): Bot | undefined {
    for (const team of game.teams) {
      const bot = team.bots.find(b => b.id === botId);
      if (bot) return bot;
    }
    return undefined;
  }

  handleBegResponse(gameId: string, botId: string, approved: boolean, comment: string): GameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Find the pending beg request
    const begRequest = game.pendingBegRequests.find(req => req.botId === botId);
    if (!begRequest) {
      throw new Error('No pending beg request for this bot');
    }

    // If approved, grant the sats
    if (approved) {
      const bot = this.findBot(game, botId);
      if (bot && bot.isAlive) {
        bot.sats += begRequest.amount;
      }
    }

    // Update the last round's history with the beg response
    const lastRound = game.history[game.history.length - 1];
    if (lastRound && lastRound.begRequests) {
      const request = lastRound.begRequests.find(req => req.botId === botId);
      if (request) {
        request.status = approved ? 'approved' : 'rejected';
      }
    }

    // Remove the pending request
    game.pendingBegRequests = game.pendingBegRequests.filter(req => req.botId !== botId);

    return game;
  }
}