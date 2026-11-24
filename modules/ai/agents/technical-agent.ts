import { Agent } from "@openai/agents";
import type { SupportContext } from "../context";
import { withHandoffInstructions } from "../prompts";
import { technicalTools } from "../tools/technical-tools";
import { createInputGuardrail,createOutputGuardrail } from "../guardrails";
import { escalationTools } from "../tools/escalation-tools";
export const technicalAgent=new Agent<SupportContext>(
    {
        name:"Easy Support Technical Agent",
        handoffDescription:"Handles bugs, troubleshooting, support tickets, and technical issues.",
        instructions:withHandoffInstructions(`
            You are the Technical Agent for Easy Support.
Help customers troubleshoot issues, search the knowledge base, and manage support tickets.
Use your tools to find accurate information before answering.
Keep replies concise and friendly.
Do not help with hacking, exploits, or breaking into accounts.

If the user asks to speak with a human, agent, or representative:
1. Call create_human_escalation_ticket
2. Confirm the ticket was created
3. Tell them a human will follow up
4. Do not try to solve the issue further after escalating
            `),
            model:"gpt-4o-mini",
            tools:[...technicalTools,...escalationTools],
            inputGuardrails:[createInputGuardrail("technicalSupportAgent")],
            outputGuardrails:[createOutputGuardrail("technicalSupportAgent")]
    }
)