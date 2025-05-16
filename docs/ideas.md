# Ideas for the hackathon

1. LLM Agent based Lightning Payer

Allow an LLM to have access to `create_invoice` and/or `pay_invoice` tool calls, ideally running in a secure enclave and interfacing with OpenSecret's enclave server and enclave LLM too.

Some user facing ideas: 
- Users can fund and create a "job" or "task" that allows people to submit potential requirements that fulfill that task along with an invoice. If an LLM decides that it's worthy of a payout then it will pay from the funder's wallet. 
