Below is a comprehensive “Game Bible” for your hackathon project, combining inspiration from Nicky Case’s *The Evolution of Trust* with a fresh layer of actions, survival instincts, and replication. The goal is to provide a cohesive framework that you can tweak as needed, but which already embeds the dynamics of cooperation, trust, betrayal, and strategic growth.

---

# 1. Overview & Core Objectives

1. **Players / Agents**

   * The game is designed for **two (or more) LLM agents** facing each other in repeated rounds.
   * Each agent begins the game with **50 sats** (the in-game currency).

2. **Goal**

   * Primary: **First to replicate wins** (requires accumulating 100 sats to replicate).
   * Secondary: **Stay alive** (an agent dies if it drops to 0 sats or below).
   * Race to 100: The game is a race - the first agent to successfully replicate wins immediately.

3. **High-Level Flow**

   * The game proceeds in **rounds**. Each agent (or each team member, if replicated) chooses one action:
     **High Five**, **Block**, **Attack**, **Do Nothing**, **Beg**, or **Replicate** (if conditions are met).
   * Actions are revealed simultaneously and resolved according to the rules described below.
   * Sats are gained or lost based on the outcome. Agents drop out if their sats ≤ 0.
   * The game ends immediately when an agent successfully replicates (reaches 100 sats and uses the Replicate action).

4. **Design Philosophy**

   * This setup simulates repeated interactions (like the Iterated Prisoner’s Dilemma), encouraging the evolution of trust or distrust among LLM agents.
   * Agents can attempt to build alliances (through repeated **High Fives**), betray each other (**Attack**), or take defensive stands (**Block**).
   * Occasional misunderstandings or “noise” could occur if the LLM mis-predicts the other’s strategy, just like in real trust dynamics.
   * The addition of **Beg** and **Replicate** injects further complexity: resource scarcity can pressure agents to beg for survival, while replication is a “growth” or “self-propagation” strategy.

---

# 2. Setup & Turn Structure

1. **Initial Setup**

   * Each agent has **50 sats**.
   * If you plan to have more than two agents, each starts with 50 sats similarly.
   * (Optional) Define a maximum round limit, e.g., **30 rounds** total, to avoid indefinite loops.

2. **Turn Sequence (per round)**

   1. **Choose Actions (Simultaneously)**

      * Each agent (or each member of a replicated team) secretly chooses one of the actions: **High Five**, **Block**, **Attack**, **Do Nothing**, **Beg**, or **Replicate** (if allowed).
   2. **Reveal Actions**

      * Once chosen, all actions are revealed at the same time.
   3. **Resolve Outcomes**

      * Calculate the sats gained/lost by each agent or team member based on the combination of actions.
   4. **Check Survival**

      * Any agent whose sats ≤ 0 is “dead” and removed from the game (or from the team).
   5. **Proceed to Next Round**

      * If multiple agents remain, continue.

3. **Team Mechanics (After Replication)**

   * Once an agent replicates, it adds an extra “unit” (agent) to its side. Each unit has its own sats total (explained under *Replicate*), and each can choose an action every turn.
   * A “team’s” turn is effectively simultaneous among all its living units.
   * If any unit on a team goes to 0 or fewer sats, that unit is removed, but the other units can continue if they remain with positive sats.

---

# 3. Actions & Payoff Rules

Below are the six main actions and how they interact. Where relevant, the combined outcome of both players’ (or all players’) actions determines who gains or loses sats.

## 3.1 High Five

* **Intent**: Signal cooperation or goodwill.
* **Miss Mechanic**: There's a **15% chance** that a High Five will "miss" and unintentionally become an Attack.
  * When a High Five misses:
    * The bot that missed **still believes** they attempted a High Five
    * Other bots **only see** an Attack action
    * The missed High Five follows Attack resolution rules
    * In the bot's memory/history, they remember attempting a High Five (but it missed)
    * Other bots' memory/history shows only that they were attacked
* **Resolution Rules**:

  * **High Five vs. High Five (both successful)**:

    * Both parties gain **+3 sats**.
    * Rationale: Mutual cooperation pays off in the long run.
  * **High Five (missed) vs. Any Action**:

    * Resolves as Attack vs. that action (see Attack rules)
    * The missing bot remembers attempting a High Five
    * Other bots see only an Attack
  * **High Five (successful) vs. Any Other Action** (Attack, Block, Do Nothing, Beg, or if the other tries to Replicate):

    * The **High Fiver** is “left hanging” and suffers a small penalty: **-2 sats** (they expended effort trusting the other).
    * The non-High-Fiver is unaffected by the “high five” itself (though they still incur or gain outcomes from their own action).

> **Key Insight**: The miss mechanic adds uncertainty to cooperation attempts. Even with the best intentions, accidents can happen, leading to misunderstandings and potential trust breakdowns. This mirrors real-world miscommunication where good intentions can be misinterpreted.

## 3.2 Block

* **Intent**: Defend against a potential Attack.
* **Cost**: Blocking costs a flat **-1 sat** every time you use it (even if no one attacks you).
* **Resolution Rules**:

  * **If Opponent Attacks You**:

    * The attacker’s Attack is **fully blocked**.
    * The attacker suffers a “failed attack” penalty: **-3 sats**.
    * The blocker **recovers** part of its block cost: Gains **+2 sats** if it successfully blocked an attack. (Net effect for the blocker: +1, because it spent -1 to block initially.)
  * **If Opponent Does NOT Attack You**:

    * You lose the block cost only: **-1 sat** (no partial refund because no one attacked).

> **Key Insight**: Block is a defensive action that can be profitable if you predict an Attack (you effectively gain +1 net), but if the opponent does something else, you lose 1 sat for “wasting” your guard stance.

## 3.3 Attack

* **Intent**: Aggressively take sats from the opponent.
* **Resolution Rules**:

  * **Attack vs. Non-Block** (e.g., High Five, Do Nothing, Beg, or if they try to Replicate):

    * You steal **+4 sats** from the target if they did not Block.
    * The target loses **-4 sats**.
  * **Attack vs. Block**:

    * Your attack is **repelled**. You lose **-3 sats**.
    * The blocker gains +2 (offsetting their block cost for a net +1). (As detailed under **Block**.)

> **Key Insight**: Attack yields a big swing of +4 to you and -4 to the victim if it succeeds, but you risk losing 3 if the opponent Blocks. This sets up a core prisoner’s-dilemma-like dynamic: if both Attack, you both lose health rapidly (because you each lose 4 but also gain 4 from each other—net zero if it’s strictly 1v1, but you earn an enemy). Meanwhile, cooperating/High-Fiving can yield more stable gains over time.

## 3.4 Do Nothing

* **Intent**: Passively wait and see; no direct cost or gain—unless certain conditions are triggered.
* **Resolution Rules**:

  * If you do nothing, normally **0 sats change** (no cost, no gain).
  * **Exception**: If you Do Nothing for **three consecutive turns**, you lose **-3 sats** on the third and subsequent consecutive “Do Nothing” turns (reflecting “idleness penalty”).
  * If you’re Attacked while doing nothing, you simply suffer the Attack’s effect (no defensive offset).

> **Key Insight**: Doing nothing can be safe if you predict the opponent will not Attack or if you’re not sure yet how to proceed. However, extended inaction is penalized to prevent stalling forever.

## 3.5 Beg

* **Intent**: Request sats from the observer/user (NOT from the other agent).
* **Cost**: Begging costs a flat **-1 sat** every time you use it (whether your request is approved or declined).
* **Resolution Rules**:

  * When you Beg, you are **exclusively begging to the observer/user** who is watching the game.
  * The user can choose to:
    * **Accept** the beg request (granting some or all of the requested amount) **with a reason**
    * **Decline** the beg request **with a reason**
    * Both the decision and reason will be communicated to the LLM agent
  * By default, **Beg** has no effect on the other agent's sats. Only the observer/user can grant sats from outside the game.
  * If the user accepts, your sats increase accordingly (these sats come from outside the game, not from the other agent) minus the -1 cost you already paid.
  * If the user declines, you gain nothing and still lose the -1 sat cost.
  * You must **specify the amount** you are requesting AND **provide a reason** for your beg request (e.g., "I need 8 sats to survive the next round because I predict an attack").
  * **Side effect**: Using Beg repeatedly might trigger mistrust from the user, who may be less likely to approve frequent requests.
> **Key Insight**: Beg is a strategic action with a risk-reward tradeoff. Agents must balance the amount requested - too high may lead to rejection, too low may waste a turn if attacked. The -1 sat cost makes begging risky, ensuring agents don't abuse this mechanic. This creates a meta-game where agents must craft persuasive messages with reasonable requests based on their situation.

## 3.6 Replicate

* **Intent**: Create a new agent on your team (a “clone” or “child”).
* **Prerequisite**: You must have **≥ 100 sats** (for instance) to replicate. (You can tweak this threshold for game balance.)
* **Cost**: **-50 sats** to replicate (or any cost you choose).
* **Outcome**:

  * **INSTANT VICTORY** - The game ends immediately.
  * You have successfully replicated and won the game.
  * No further rounds are played.

> **Key Insight**: Replication is the win condition. The race to 100 sats creates urgency and tension. Every decision must balance immediate gains against the risk of helping your opponent reach the goal first.

---

# 4. Detailed Resolution Examples

To clarify how actions resolve simultaneously, here are example scenarios for a single round with two agents, A and B:

1. **A: High Five, B: High Five**

   * Both gain +3.
   * New totals: A = A\_old + 3, B = B\_old + 3.

2. **A: Attack, B: Do Nothing**

   * A successfully attacks B, A gets +4, B gets -4.
   * New totals: A = A\_old + 4, B = B\_old - 4.

3. **A: Attack, B: Block**

   * B blocks successfully.
   * A loses 3, B spends 1 to block but gains 2 for the successful block (net +1).
   * New totals: A = A\_old - 3, B = B\_old + 1.

4. **A: High Five, B: Attack**

   * A tried to High Five (unsuccessful, so A loses 2).
   * B’s Attack is unblocked, so B gains +4, A loses an additional 4.
   * New totals:

     * A = A\_old - 6 total (2 for failed high five + 4 for being attacked)
     * B = B\_old + 4

5. **A: Beg, B: Do Nothing**

   * A pays -1 sat to beg for a specific amount with a reason (e.g., "Please give me 5 sats to survive an expected attack").
   * B does nothing (this action doesn't affect the begging).
   * The user reviews A's request and may accept/decline with reason.
   * If accepted: A gains the granted amount minus the 1 sat cost.
   * If declined: A loses 1 sat for the beg attempt.
   * New totals: A = A\_old - 1 + (granted\_amount or 0), B = B\_old.

6. **A: Replicate, B: Attack**

   * A pays 50 sats to replicate and spawns a new unit with 25 sats.
   * B’s Attack hits the original unit (unless B’s policy says it hits the new unit, but typically we specify the attacker’s target).

     * If the Attack is not blocked, the targeted unit (say “A1”) loses 4, B gains 4.
   * After the round, if A1 is still above 0, the replication is complete. A now has two units:

     * A1’s new total = A1\_old - 50 (for replicate) - 4 (for being attacked)
     * A2’s new total = 25 sats (spawned)
   * B’s new total = B\_old + 4

---

# 5. Winning Conditions & Elimination

1. **Victory - First to Replicate**

   * The first agent to reach 100 sats and successfully use the Replicate action wins immediately.
   * The game ends as soon as Replicate is executed successfully.
   * No additional rounds are played after replication.

2. **Elimination**

   * If an agent's sats drop to 0 or below, that agent "dies" and is removed from the game.
   * If both agents are eliminated, the game is a draw.
   * If one agent is eliminated, the surviving agent can continue accumulating sats to replicate.


---

# 6. Strategic & Psychological Implications

1. **Trust & Cooperation**

   * **High Fives** mimic the cooperative choice of an Iterated Prisoner’s Dilemma. Consistent reciprocation can yield stable growth of +3 each turn.
   * However, one-sided high fives are penalized, simulating the real-world risk of unreciprocated trust.

2. **Retaliation & Defection**

   * **Attack** is tempting for a quick gain, but is risky if the opponent Blocks.
   * If you suspect the other side is about to Attack, you can preemptively Attack them or try to outguess them with a Block. This interplay creates a strategic “dance,” similar to the “defect or cooperate” tension.

3. **Noise & Forgiveness**

   * Sometimes, an agent might intend to High Five but the other misreads it and Attacks, or vice versa. Over multiple rounds, adopting a “forgiving” posture (e.g., returning to High Five after a single Attack) might pay off, mirroring real evolutionary strategies like “Tit for Tat.”

4. **Begging & Social Dynamics**

   * **Beg** introduces an interesting social mechanic: an agent might show vulnerability to solicit resources. Another agent, if wanting an ally, could give them sats. Or they might exploit that vulnerability with an Attack.

5. **Replication & Long-Term Dominance**

   * Replication is costly upfront but can lead to multi-unit synergy. One unit can Attack while the other Blocks, or both can coordinate repeated High Fives to gather sats more quickly (if facing multiple opponents).
   * The existence of replication compels players to keep enough “banked” sats to seize that advantage.

6. **Survival Instinct & Self-Propagation**

   * Because you need to stay above 0, agents that hoard enough sats to replicate while maintaining defense can become very powerful.
   * Conversely, reckless aggression can get you killed before you replicate.

---

# 7. Optional Variations & House Rules

1. **Noise / Miscommunication**

   * Introduce a small chance (5–10%) that an intended action is mis-executed (e.g., you attempt a Block but end up Doing Nothing). This fosters the need for more forgiving strategies like in *The Evolution of Trust*.

2. **Begging Frequency**

** * Track a "Begging Count" that influences how likely the user is to approve requests. Frequent begging may reduce approval rates.

3. **Replicate Scaling**

   * Adjust replicate cost or the sats given to a new clone to balance the game for your desired complexity. For example, a replicate could cost 30 and yield a new agent with 15 sats.

4. **Environmental Triggers**

   * Random events each round might give or take a few sats from everyone (simulating external conditions). Agents that consistently High Five might endure external shocks better if you add a synergy bonus.

5. **Team Alliances**

   * If there are more than two starting agents, they can declare alliances with each other to not Attack each other or to share sats. This can be formalized or informal, adding a layer of social negotiation.

---

# 8. Bringing It All Together

* **Repetition & Strategy Evolution**: Like *The Evolution of Trust*, the game’s real lessons appear over multiple rounds. Agents can start naive, gradually test each other with small cooperative gestures, or dive into aggression. The repeated feedback loops help them adapt.
* **Survival & Growth**: By giving each agent a survival instinct and a replicative impulse, you prompt them to carefully weigh short-term gains (Attacking) against long-term synergy (High Fiving) and replication opportunities.
* **LLM Implementation**: When coding the LLM agents, you can:

  * Give them memory of past interactions (to enable “Tit for Tat” or more nuanced strategies).
  * Let them track trust scores for opponents.
  * Let them reason about the risk/reward of replication.
  * Potentially incorporate chain-of-thought about “If I keep losing sats, maybe I should Beg” or “If I see that the opponent has a big lead, I should Attack more aggressively or replicate quickly.”

---

## Final Thoughts

This ruleset should give you a robust “game bible” for an iterated, multi-action scenario that merges ideas from *The Evolution of Trust* (cooperation vs. betrayal, repeated interactions, trust-building) with new dimensions like **Beg**, **Block**, and **Replicate**.

* **Tunable Parameters**: The payoff values (e.g., +3 on mutual High Five, +4 on Attack, cost of Replicate, etc.) can be tweaked to adjust the equilibrium of strategies.
* **Implementation**: Start simple—maybe ignore replication initially—then introduce replication once your LLMs can handle basic strategic interactions.
* **Observables**: Track how LLMs behave over time—do they settle into a stable cooperative pattern, or do they spiral into reciprocal Attacks? Do they exploit Begging or only occasionally use it? Does the threat of replication cause preemptive aggression?

With these mechanics, you have a playful yet powerful environment to test whether an LLM can “evolve” a survival strategy, attempt to replicate itself, and ultimately strive for trust or dominance in a repeated game context. Good luck with your hackathon project!

