import { Agent } from "@openai/agents";
export const supportAgent=new Agent(
    {
        name:"Easy Support",
        instructions:"You are a helpful support agent for Easy Support "+"Answer clearly,keep reply concise, and ask followup questions when needed.",
        model:"gpt-4o-mini",
        modelSettings:{maxTokens:1200,reasoning:{
            effort:"medium",summary:"concise"
        }}
    }
);