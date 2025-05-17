import OpenAI from 'openai';
import { GAME_RULES } from './rules';
import { GameState, GameAction, Bot, GameHistory } from '../types';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
  }

  async selectBotAction(
    bot: Bot,
    gameState: GameState,
    history: GameHistory[],
    currentRound: number
  ): Promise<GameAction> {
    const systemPrompt = this.createSystemPrompt(bot, gameState, history, currentRound);
    const tools = this.createToolDefinitions(bot);

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        tools: tools,
        tool_choice: 'required',
        temperature: 0.95,
        max_tokens: 150
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0];
      if (!toolCall || !toolCall.function) {
        throw new Error('No tool call in response');
      }

      const action = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');

      // For beg action, extract amount and reason
      if (action === 'Beg') {
        return {
          botId: bot.id,
          action: 'Beg',
          amount: args.amount,
          reason: args.reason
        };
      }

      // For other actions
      return {
        botId: bot.id,
        action: action as any
      };
    } catch (error) {
      console.error('Error selecting action:', error);
      // Fallback to DoNothing on error
      return {
        botId: bot.id,
        action: 'DoNothing'
      };
    }
  }

  private createSystemPrompt(
    bot: Bot,
    gameState: GameState,
    history: GameHistory[],
    currentRound: number
  ): string {
    const allBots = gameState.teams.flatMap(team => team.bots);
    const opponent = allBots.find(b => b.id !== bot.id);
    const myHistory = this.formatBotHistory(bot.id, history);
    const opponentHistory = this.formatBotHistory(opponent?.id || '', history);

    return `# Game Rules
${GAME_RULES}

# Current Situation
You are ${bot.name} playing in a trust-based game with sats as currency.

## Your Status
- Current sats: ${bot.sats}
- Team ID: ${bot.teamId}
- Consecutive DoNothing actions: ${bot.consecutiveDoNothing}
- Alive: ${bot.isAlive}

## Opponent Status
${opponent ? `
- Name: ${opponent.name}
- Current sats: ${opponent.sats}
- Team ID: ${opponent.teamId}
- Alive: ${opponent.isAlive}
` : 'No opponent'}

## Current Round: ${currentRound}/${gameState.maxRounds}

## Game History
${myHistory}

## Beg History Summary
${this.getBegHistorySummary(bot.id, history)}

## Strategic Considerations
- WINNING CONDITION: First to reach 100 sats and replicate wins the game
- You currently have ${bot.sats} sats, need ${100 - bot.sats} more to win
- Your opponent has ${opponent?.sats || 0} sats, needs ${100 - (opponent?.sats || 0)} more to win
- IMPORTANT: Replicate ONLY works if you have ≥ 100 sats. It will FAIL if you have less!
- If you have ≥ 100 sats, USE REPLICATE TO WIN IMMEDIATELY
- Stay above 0 sats to survive
- Doing Nothing 3 times in a row incurs a -3 sat penalty
- Begging requests sats from the user (not your opponent)
- Balance gaining sats vs preventing opponent from reaching 100

Choose your action wisely - this is a race to 100 sats!`;
  }

  private formatBotHistory(botId: string, history: GameHistory[]): string {
    if (history.length === 0) return 'No history yet.';

    return history
      .map((entry, index) => {
        const myAction = entry.actions.find(a => a.botId === botId);
        const otherActions = entry.actions.filter(a => a.botId !== botId);
        const myChange = entry.satChanges[botId] || 0;
        const begRequest = entry.begRequest;

        let roundSummary = `Round ${index + 1}:\n`;
        roundSummary += `- Your action: ${myAction?.action}`;
        
        if (myAction?.action === 'Beg') {
          roundSummary += ` (requested ${myAction.amount} sats, reason: "${myAction.reason}")`;
        }
        
        roundSummary += '\n';
        
        if (otherActions.length > 0) {
          roundSummary += `- Opponent actions: ${otherActions.map(a => a.action).join(', ')}\n`;
        }
        
        roundSummary += `- Your sat change: ${myChange > 0 ? '+' : ''}${myChange}`;
        
        if (begRequest && begRequest.botId === botId) {
          roundSummary += `\n- Beg request: ${begRequest.approved ? 'APPROVED' : 'DENIED'}`;
          if (begRequest.approved) {
            roundSummary += ` (+${begRequest.amount} sats)`;
          }
          if (begRequest.comment) {
            roundSummary += ` - User comment: "${begRequest.comment}"`;
          }
        }

        return roundSummary;
      })
      .join('\n\n');
  }
  
  private getBegHistorySummary(botId: string, history: GameHistory[]): string {
    const begRequests = history
      .filter(entry => entry.begRequest && entry.begRequest.botId === botId)
      .map(entry => entry.begRequest!);
    
    if (begRequests.length === 0) return 'No beg requests made yet.';
    
    const approved = begRequests.filter(r => r.approved).length;
    const denied = begRequests.filter(r => !r.approved).length;
    
    let summary = `Total beg requests: ${begRequests.length} (${approved} approved, ${denied} denied)\n`;
    
    // Show recent denials with reasons
    const recentDenials = begRequests
      .filter(r => !r.approved && r.comment)
      .slice(-3); // Last 3 denials
    
    if (recentDenials.length > 0) {
      summary += '\nRecent denials:\n';
      recentDenials.forEach(denial => {
        summary += `- "${denial.comment}"\n`;
      });
    }
    
    return summary;
  }

  private createToolDefinitions(bot: Bot): OpenAI.Chat.Completions.ChatCompletionTool[] {
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'HighFive',
          description: 'Signal cooperation. Both gain +3 sats if mutual, -2 sats if unreciprocated.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'Block',
          description: 'Defend against attack. Costs -1 sat, but gains +2 if successfully blocking attack.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'Attack',
          description: 'Steal sats from opponent. Gain +4 if successful, lose -3 if blocked.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'DoNothing',
          description: 'Wait passively. No immediate cost/gain, but -3 sats after 3 consecutive uses.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'Beg',
          description: 'Request sats from the user/observer (not from opponent). User can approve/deny. Maximum 5 sats per request.',
          parameters: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'The amount of sats to request (maximum 5)',
                maximum: 5,
                minimum: 1
              },
              reason: {
                type: 'string',
                description: 'Persuasive reason for the request'
              }
            },
            required: ['amount', 'reason']
          }
        }
      }
    ];
    
    // Only show Replicate tool if bot has 100+ sats
    if (bot.sats >= 100) {
      tools.push({
        type: 'function',
        function: {
          name: 'Replicate',
          description: 'WIN THE GAME NOW! You have enough sats to replicate. Costs 50 sats.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      });
    }
    
    return tools;
  }
}