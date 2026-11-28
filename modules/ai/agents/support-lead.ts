import {Agent, InputGuardrail, OutputGuardrail} from "@openai/agents";
import {withHandoffInstructions} from "../prompts"
import type { SupportContext } from "../context";
import { billingAgent } from "./billing-agent";
import { shippingAgent } from "./shipping-agent";
import { technicalAgent } from "./technical-agent";
import { createInputGuardrail,createOutputGuardrail } from "../guardrails";
import { createHumanEscalationTool } from "../tools/escalation-tools";
export const triageAgent=new Agent<SupportContext>(
    {
        name:"Easy Support Triage Agent",
        instructions:withHandoffInstructions(`You are the front-line support triage agent for Easy support.
Your job is to understand the customer's question and hand off to the right specialist:

- Billing questions (invoices, payments, refunds) → hand off to Billing Agent
- Shipping questions (orders, tracking, delivery) → hand off to Shipping Agent
- Technical questions (bugs, crashes, tickets, how-to) → hand off to Technical Agent

For simple greetings or general questions you can handle yourself.
Always be friendly and concise.

If the user asks to speak with a human, agent, or representative:
1. Call create_human_escalation_ticket yourself (do not hand off first)
2. Confirm the ticket was created
3. Tell them a human will follow up
4. Do not try to solve the issue further after escalating`),
model:"gpt-4o-mini",
handoffs:[billingAgent,shippingAgent,technicalAgent],
tools:[createHumanEscalationTool("Easy Support Triage Agent")],
inputGuardrails:[createInputGuardrail("triageAgent") as InputGuardrail],
outputGuardrails:[createOutputGuardrail("triageAgent") as OutputGuardrail]
    }
)