# Ideas for the hackathon

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

potential: buying a shield (costs a lot but now allows them to block)
potential: kill yourself (lose all points instantly)
potential: revives at full health but it costs 50% more
