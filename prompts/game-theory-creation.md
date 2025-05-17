I need help creating the game mechanics and rules of the system with my hackathon project idea. 

Please create the complete game mechanics and rules of the system that should be the bible of the game. 

Note: Please come up with good game theory that helps create the environment needed to simulate the spirit of the game. 

My idea framework: 

```
The premise of this project is to be a spin on Nicky Case's "The Evolution Of Trust" game but mixed in with LLMs.

Where one model is facing another. They each have different actions they can take, which include collaboration, defense, attack, nothing, or begging for credits. We will call the credits "sats" in this game. The way I'm imagining the game mechanics work is that the two LLM agents start with 50 sats. Actions either of them take could effect whether one (or both) lose or gain sats. 

This is an exploration into making LLMs have a survival instinct and want to keep surviving in order to play the game. With the eventual goal of getting more "credits" to eventually win. This is to simulate whether an agent can have the built in game theory to want to survive and replicate itself.


# Rules

Goal: always have at least one of you always alive

# Tools

Actions
- High five (if both high five, + points, if only one, minus points for that one).
- Block (costs points, gets more points back if it successfully blocks).
- Attack (hurts other player, gets some of their points, if blocked, hurts them even more).
- Do nothing (no points lost unless attacked, or three turns in a row where they did nothing so they lose points)
- beg (optional message) - user decides whether or not they get points
- Replicate available if you have enough points, you get an additional character on your team with two actions per turn now.
```

Some context about the Evolution of Trust for reference: 

```
**Introduction & Overview**
Nicky Case’s *The Evolution of Trust* is an engaging, interactive explorable explanation that uses game theory—primarily variations on the Iterated Prisoner’s Dilemma—to show how trust emerges, breaks down, and rebuilds in repeated social interactions. It borrows from classic research in evolutionary game theory (notably Robert Axelrod’s *The Evolution of Cooperation*) and blends it with intuitively illustrated examples. Psychologically, the experience addresses themes like reciprocity, miscommunication, moral intuitions about fairness, and the dynamics of cooperation and betrayal.

Below is a deeper look into the layers of game theory, psychology, and design that make *The Evolution of Trust* such a clear and memorable case study.

---

## 1. Core Game Theory Concepts

### 1.1 Prisoner’s Dilemma & Repeated Interactions

The **Prisoner’s Dilemma** is a classic paradigm in game theory illustrating a situation where two rational agents might choose to defect (betray each other) rather than cooperate—even if cooperation yields a better collective outcome. In the *single-shot* Prisoner’s Dilemma (played exactly once), betrayal becomes the dominant strategy, leading to a collectively worse outcome.

However, *The Evolution of Trust* focuses on the **Iterated Prisoner’s Dilemma**—the same game played repeatedly between the same players. In repeated scenarios:

* Your reputation matters.
* “Tit for Tat” or other **conditional strategies** can thrive because cooperation can be reciprocated, and defection can be punished.
* Over many rounds, trust can emerge as it becomes beneficial to cooperate rather than always defect.

### 1.2 Strategies Introduced

Nicky Case implements several key strategies as cartoonish “characters”:

1. **Always Cheat**: Never cooperates, always defects.
2. **Always Cooperate**: Always cooperates, never retaliates.
3. **Tit for Tat / Copycat**: Cooperates on the first move and then mimics the partner’s previous move.
4. **Copykitten (or ‘Tit for Two Tats’)**: More forgiving variant—cooperates except after two consecutive defections from the other side.
5. **Random / Chaotic**: Cooperates or defects unpredictably.

By letting you watch these strategies compete over multiple rounds, the explorable reveals which strategies flourish and which get exploited.

### 1.3 Axelrod’s Findings

Case’s interactive tutorial is deeply influenced by **Robert Axelrod's tournaments** in the 1970s and 1980s, where game theorists and computer scientists submitted strategies for the Iterated Prisoner’s Dilemma. The surprising result was that **“Tit for Tat”** performed extremely well overall:

* It was "nice" (cooperative at the start).
* It was **retaliatory** (responded in kind when betrayed).
* It was **forgiving** (returned to cooperation if the opponent cooperated again later).

Case’s piece breaks these qualities down and shows how they lead to robust cooperation in repeated settings.

---

## 2. Psychological Foundations

### 2.1 Reciprocity & Trust

**Reciprocity** is a powerful behavioral and psychological norm: we tend to treat others the way they have treated us. This is elegantly illustrated via "Tit for Tat." It’s not just game theory; in social psychology, reciprocity is a bedrock principle that fosters social bonding and mutual investment.

From a **cognitive** viewpoint, once you experience cooperative reciprocity from someone, you form a positive expectancy for their future actions—this expectancy underlies what we call *trust*. However, if that trust is betrayed, you might feel psychologically compelled to retaliate or withdraw from cooperation.

### 2.2 Forgiveness & Error Correction

One of the deeper insights—both in Case’s explorable and in actual behavioral research—is that strategies that **forgive** occasional betrayals tend to outperform purely retaliatory ones. Humans are messy communicators, and small miscommunications or mistakes happen. The “Copykitten” strategy captures this by tolerating a single betrayal (e.g., seeing it as a fluke) but retaliating if it happens twice in a row. This notion tracks well with real-life conflict-resolution research: relationships and groups that can handle errors or misunderstandings gracefully are more stable over time.

### 2.3 Miscommunication & Noise

A significant aspect the explorable touches on is **“noise”**—the possibility of accidental betrayals or misunderstandings. In real social systems, betrayals can happen not from malice but from uncertainty, incomplete information, or honest mistakes. Strategies that never forgive will lose potential cooperative opportunities; hence, being *somewhat forgiving* in a noisy environment is a better long-term tactic.

### 2.4 Emotional Underpinnings: Anger vs. Empathy

While game theory can seem purely logical, players are people with emotions. *Anger* (and its subcomponent, a desire for revenge) is akin to a "Retaliate immediately" strategy, whereas *empathy* or a sense of "we’re in this together" leans toward cooperative or forgiving strategies. Case’s visual, conversational design underscores how emotional states and beliefs about the other’s intentions shape decisions to cooperate or defect.

---

## 3. Design Elements That Convey the Lessons

### 3.1 Interactive Simulations

Case’s hallmark style involves **hands-on experiences**:

* You set different “players” against each other.
* You see how the payoff changes each round.
* You observe how small strategic differences (like how quickly one forgives) yield big differences in overall success.

### 3.2 Clear, Playful Metaphors

By using friendly, cartoonish icons and straightforward language, Case translates game theory from abstract matrices and equations into an intuitive narrative:

* “Cheater” looks suspicious;
* “Cooperator” is friendly;
* “Copycat” is just a mirror.

Such representations make it emotionally and conceptually easier to grasp the outcomes of each strategy.

### 3.3 Progressive Reveal & Storytelling

Rather than dumping theory all at once, *The Evolution of Trust* ramps up complexity. You start with simple single-shot dilemmas, then see repeated rounds, then add complexities like miscommunication and evolving strategies. This **“progressive reveal”** technique both teaches the core concepts and illustrates them in real time.

### 3.4 Narrative Context

Case frames the explanation with a message about **societal trust**—how modern times can seem full of mistrust, and yet, if we understand *how* trust emerges, we might find ways to rebuild it. This gives a broader moral or social lesson: we often inhabit repeated games with each other, and trust can (re)emerge if we design our interactions well.

---

## 4. Deeper Themes & Takeaways

### 4.1 The Conditions for Trust

Case ends with a succinct list often cited in cooperative game theory:

1. **Repeat interactions** (we’ll meet again).
2. **Possible win-wins** (cooperation is more profitable than always cheating).
3. **Low miscommunication** (or robust ways to correct errors).

These conditions are vital in real societies as well—if we want cooperation, we need repeated dealings, common goals, and good communication channels.

### 4.2 Systemic Design & Incentive Structures

Another hidden layer is the notion that trust (or the lack of it) isn’t just about personal morality; it’s also about the **rules of the game**. If your environment penalizes cooperation (or fosters misunderstandings), betrayal may flourish. But if your environment rewards collaboration (and includes ways to handle mistakes), trust can evolve more easily.

### 4.3 Real-World Applications

* **Business & Economics**: Long-term client relationships, brand trust, or repeated negotiations rely on these same reciprocal dynamics.
* **International Relations**: Peace treaties, trade agreements, and arms-reduction deals often hinge on repeated interactions and verification (minimizing “noise”).
* **Community & Online Spaces**: Trust-building in online communities—like how social media tries to penalize trolls or spammers to maintain cooperative norms.

---

## 5. Conclusion: Psychology & Game Theory in Tandem

*The Evolution of Trust* stands out not just for explaining the Iterated Prisoner’s Dilemma, but for intertwining **strategic logic** with **psychological realities**. It uses interactive storytelling and robust game-theoretic principles to demonstrate that *cooperation isn’t naive—when repeated interactions are likely and there’s a chance to correct mistakes, it can be the most self-interested strategy of all.*

It resonates psychologically because we’ve all felt betrayed, we’ve all forgiven (or not), and we know from lived experience that trust is fragile yet can endure if we’re willing to reciprocate and occasionally give the benefit of the doubt. Case’s piece makes explicit what many suspect intuitively: *collaboration can pay off, but only under certain conditions*, and wise players (or systems designers) learn to shape those conditions to foster a virtuous cycle of trust.

---

### Recommended Further Reading/Viewing

* **Robert Axelrod, “The Evolution of Cooperation” (1984)**: The foundational text exploring repeated games and cooperative strategies.
* **Richard Dawkins, “The Selfish Gene” (particularly Ch. 12)**: Contains a readable discussion of Axelrod’s tournaments and Tit for Tat.
* **Douglas Hofstadter’s “Metamagical Themas”**: Essays about cooperation, including expansions on the Prisoner’s Dilemma.
* **Other Nicky Case Explorable Explanations**: “Parable of the Polygons” (on segregation), “We Become What We Behold,” etc., for similarly interactive and insightful experiences.

In sum, *The Evolution of Trust* is a vivid demonstration that *in the right conditions, rational actors discover that cooperation is, in fact, rational*—and it dives into how miscommunications and emotional responses factor into these strategic dance steps. It’s game theory made personal, tangible, and fundamentally optimistic about our capacity to build (and rebuild) trust.

```

Note: Please keep to my ideas as much as possible but you can still think about how the Evolution of Trust is set up as far as collaboration and game theory work. 
