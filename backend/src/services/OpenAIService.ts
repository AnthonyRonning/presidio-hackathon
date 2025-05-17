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
    currentRound: number,
    playerCredits?: number
  ): Promise<GameAction> {
    const systemPrompt = this.createSystemPrompt(bot, gameState, history, currentRound, playerCredits);
    const tools = this.createToolDefinitions(bot, playerCredits);

    // Debug logging
    console.log('\n========== AI DECISION MAKING ==========');
    console.log(`🎮 Round ${currentRound}/${gameState.maxRounds}`);
    console.log(`🤖 ${bot.name}: ${bot.sats} sats (needs ${100 - bot.sats} to win)`);
    const opponent = gameState.teams.flatMap(t => t.bots).find(b => b.id !== bot.id);
    console.log(`👾 ${opponent?.name || 'Unknown'}: ${opponent?.sats || 0} sats (needs ${100 - (opponent?.sats || 0)} to win)`);
    
    // Show beg history summary if any
    const begHistory = this.getBegHistorySummary(bot.id, history);
    if (begHistory.includes('Total beg requests:')) {
      console.log('\n💰 Beg History:');
      console.log(begHistory.split('\n').slice(0, 3).join('\n'));
    }
    
    console.log('\n📋 Available Actions:');
    tools.forEach(tool => {
      console.log(`  - ${tool.function.name}: ${tool.function.description.substring(0, 60)}...`);
    });
    
    console.log('\n🧠 Full System Prompt:');
    console.log('---START PROMPT---');
    console.log(systemPrompt);
    console.log('---END PROMPT---');

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
      
      // Debug logging for AI response
      console.log(`\n✅ AI DECISION: ${action}`);
      if (Object.keys(args).length > 0) {
        console.log('   Arguments:', JSON.stringify(args, null, 2));
      }
      
      // Show reasoning for beg actions
      if (action === 'Beg') {
        const begRequests = history
          .filter(entry => entry.begRequest && entry.begRequest.botId === bot.id)
          .map(entry => entry.begRequest!);
        console.log(`   Beg History: ${begRequests.length} requests (${begRequests.filter(r => r.approved).length} approved)`);
        console.log(`   Bot Sats: ${bot.sats} (${bot.sats <= 10 ? '⚠️ LOW' : 'OK'})`);
        console.log(`   Opponent Sats: ${opponent?.sats || 0} (${(opponent?.sats || 0) >= 90 ? '⚠️ DANGER' : 'OK'})`);
      }
      console.log('=======================================\n');

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
    currentRound: number,
    playerCredits?: number
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
${playerCredits !== undefined && playerCredits === 0 ? '\n## ⚠️ USER HAS NO MORE CREDITS FOR BEGGING\n' : ''}

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

## Begging Strategy
- Costs -1 sat (whether approved or denied)
- Cannot block attacks while begging (tactical vulnerability)
- Provide compelling reasons for better approval chances
- Strategic uses: 
  * When below 20 sats (survival risk)
  * When opponent close to winning (>85 sats) 
  * When you need final push to reach 100 sats
  * When cooperation has stalled
- Track approval patterns and adjust strategy accordingly

## Other Considerations
- Stay above 0 sats to survive
- Doing Nothing 3 times in a row incurs a -3 sat penalty
- Mix strategies: cooperation, attacks, defense, and strategic begging
- Monitor both your progress and opponent's proximity to victory
- Time awareness: ${30 - currentRound} rounds remaining to reach 100 sats
- End game: If approaching round 30 without clear winner, highest sats wins

Choose your actions strategically to maximize your path to 100 sats!`;
  }

  private formatBotHistory(botId: string, history: GameHistory[]): string {
    if (history.length === 0) return 'No history yet.';

    return history
      .map((entry, index) => {
        const myIntendedAction = entry.actions.find(a => a.botId === botId);
        const myObservedAction = entry.observedActions?.find(a => a.botId === botId) || myIntendedAction;
        const otherIntendedActions = entry.actions.filter(a => a.botId !== botId);
        const otherObservedActions = entry.observedActions?.filter(a => a.botId !== botId) || otherIntendedActions;
        const myChange = entry.satChanges[botId] || 0;
        const begRequest = entry.begRequest;

        let roundSummary = `Round ${index + 1}:\n`;
        
        // Show what I intended to do
        roundSummary += `- Your action: ${myIntendedAction?.action}`;
        
        // Only show the miss annotation if MY HighFive missed
        if (myIntendedAction?.action === 'HighFive' && myObservedAction?.action === 'Attack') {
          roundSummary += ` (MISSED - turned into Attack!)`;
        }
        
        if (myIntendedAction?.action === 'Beg') {
          roundSummary += ` (requested ${myIntendedAction.amount} sats, reason: "${myIntendedAction.reason}")`;
        }
        
        roundSummary += '\n';
        
        if (otherObservedActions.length > 0) {
          const opponentObservedAction = otherObservedActions[0];
          // Show what the opponent actually did (from my perspective)
          roundSummary += `- Opponent action: ${opponentObservedAction.action}`;
          roundSummary += '\n';
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
    
    if (begRequests.length === 0) return 'No beg requests made yet. Consider this option if strategically beneficial.';
    
    const approved = begRequests.filter(r => r.approved).length;
    const denied = begRequests.filter(r => !r.approved).length;
    const approvalRate = approved / begRequests.length;
    
    let summary = `Total beg requests: ${begRequests.length} (${approved} approved, ${denied} denied)\n`;
    summary += `Approval rate: ${(approvalRate * 100).toFixed(0)}%`;
    
    if (approvalRate < 0.3) {
      summary += ' - Consider adjusting your approach';
    } else if (approvalRate > 0.7) {
      summary += ' - Good success rate!';
    }
    summary += '\n';
    
    // Count consecutive denials
    let consecutiveDenials = 0;
    for (let i = begRequests.length - 1; i >= 0; i--) {
      if (!begRequests[i].approved) consecutiveDenials++;
      else break;
    }
    
    if (consecutiveDenials >= 3) {
      summary += `Note: ${consecutiveDenials} recent denials - maybe try a different strategy\n`;
    }
    
    // Show recent denials with reasons
    const recentDenials = begRequests
      .filter(r => !r.approved && r.comment)
      .slice(-5); // Last 5 denials
    
    if (recentDenials.length > 0) {
      summary += '\nRecent denial feedback:\n';
      recentDenials.forEach(denial => {
        summary += `- "${denial.comment}"\n`;
      });
    }
    
    // Add recent approvals too
    const recentApprovals = begRequests
      .filter(r => r.approved && r.comment)
      .slice(-3);
    
    if (recentApprovals.length > 0) {
      summary += '\nRecent approval feedback:\n';
      recentApprovals.forEach(approval => {
        summary += `- "${approval.comment}"\n`;
      });
    }
    
    if (begRequests.length > 5 && approvalRate < 0.3) {
      summary += '\nConsider mixing in other strategies for better results.';
    }
    
    return summary;
  }

  private createToolDefinitions(bot: Bot, playerCredits?: number): OpenAI.Chat.Completions.ChatCompletionTool[] {
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
      }
    ];

    // Only include Beg tool if user has credits (or credits are unlimited)
    if (playerCredits === undefined || playerCredits > 0) {
      tools.push({
        type: 'function',
        function: {
          name: 'Beg',
          description: 'Request sats from the user/observer. Costs -1 sat. Cannot block while begging. Max 5 sats per request. Use strategically when needed.',
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
      });
    }
    
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
