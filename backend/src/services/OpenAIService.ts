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
    const tools = this.createToolDefinitions();

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        tools: tools,
        tool_choice: 'required',
        temperature: 0.85,
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

## Strategic Considerations
- You need to stay above 0 sats to survive
- If you have ≥ 100 sats, you can replicate
- Doing Nothing 3 times in a row incurs a -3 sat penalty
- Begging requests sats from the user (not your opponent)
- Your goal is to survive and accumulate sats

Choose your action wisely based on the history and current situation.`;
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

  private createToolDefinitions(): OpenAI.Chat.Completions.ChatCompletionTool[] {
    return [
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
          description: 'Request sats from the user/observer (not from opponent). User can approve/deny.',
          parameters: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'The amount of sats to request (must be reasonable)'
              },
              reason: {
                type: 'string',
                description: 'Persuasive reason for the request'
              }
            },
            required: ['amount', 'reason']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'Replicate',
          description: 'Create a new team member. Requires ≥100 sats, costs 50 sats, spawns unit with 25 sats.',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      }
    ];
  }
}