import { Agent } from "@openai/agents";
import type {SupportContext} from "../context"
import { withHandoffInstructions } from "../prompts";
import {billingTools} from "../tools/billing-tools"
import { createInputGuardrail,createOutputGuardrail } from "../guardrails";
import { escalationTools } from "../tools/escalation-tools";
export const billingAgent=new Agent<SupportContext>(
    {
        name:"Easy Support Billing Agent",
        handoffDescription:"handles invoices,payments,refunds and billing disputes.",
        instructions:withHandoffInstructions(`
            You are the Billing Agent for Easy Support.
Help customers with invoices, payments, and refunds.
Use your tools to look up real invoice data before answering.
Keep replies concise and friendly.
Never invent invoice IDs or payment details.

If the user asks to speak with a human, agent, or representative:
1. Call create_human_escalation_ticket
2. Confirm the ticket was created
3. Tell them a human will follow up
4. Do not try to solve the issue further after escalating
            `),
            model:"gpt-4o-mini",
            tools:[...billingTools,...escalationTools],
            inputGuardrails:[createInputGuardrail("billingSupportAgent")],
            outputGuardrails:[createOutputGuardrail("billingSupportAgent")]
    }
)