import {run} from "@openai/agents"
import prisma from "@/lib/db"
import { messageToInput } from "./message-to-input";
import { SupportContext } from "./context";
import { triageAgent } from "./agents";
async function saveUserMessage(conversationId:string,content:string){
    await prisma.message.create(
        {
            data:{
                conversationId,
                content,
                role:"USER"
            }
        }
    )
}
async function saveAssistantMessage(conversationId:string,content:string,activeAgentName:string|null,toolUsed:string[]){
    await prisma.message.create(
        {
            data:{
                conversationId,
                content,
                role:"ASSISTANT",
                agentName:activeAgentName,
                toolsUsed:toolUsed
            }
        }
    );
    await prisma.conversation.update(
        {
            where:{id:conversationId},
            data:{updatedAt:new Date()}
        }
    );
}
async function getConversationMessages(conversationId:string){
    return prisma.message.findMany(
        {
            where:{conversationId},
            orderBy:{createdAt:"asc"}
        }
    );
}
type chatStreamEvent=|{type:'agent';name:string}|{type:'tool';name:string}|{type:'text';delta:string}
function encodeEvent(event:chatStreamEvent){
    return new TextEncoder().encode(`${JSON.stringify(event)}\n`)
}
function getToolName(item: unknown): string | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const runItem = item as {
    type?: unknown;
    rawItem?: {
      type?: unknown;
      name?: unknown;
    };
  };

  if (
    runItem.type === "tool_call_item" &&
    runItem.rawItem?.type === "function_call" &&
    typeof runItem.rawItem.name === "string"
  ) {
    return runItem.rawItem.name;
  }

  return null;
}
export async function runStreamingSupportChat(conversationId:string,userMessage:string,context:SupportContext){
    await saveUserMessage(conversationId,userMessage);
    const messages= await getConversationMessages(conversationId)
    const agentStream=await run(triageAgent,messageToInput(messages),{stream:true,context})
    let assistantReply=""
    let activeAgentName:string|null="support Triage Agent"
    const toolUsed:string[]=[]
    return new ReadableStream<Uint8Array>({
        async start(controller) {
            try{
               if(activeAgentName){
                controller.enqueue(
                    encodeEvent({type:"agent",name:activeAgentName})
                )
               }
               for await(const event of agentStream){
                if(event.type==="agent_updated_stream_event"){
                    activeAgentName=event.agent.name;
                    controller.enqueue(
                        encodeEvent({type:"agent",name:activeAgentName})
                    )
                }
                if(event.type==="run_item_stream_event"&&event.name==="tool_called"){
                    const toolName=getToolName(event.item);
                    if(toolName&&!toolUsed.includes(toolName)){
                        toolUsed.push(toolName);
                        controller.enqueue(
                            encodeEvent({type:"tool",name:toolName})
                        )
                    }
                }
                if(event.type==="raw_model_stream_event"&&event.data.type==="output_text_delta"){
                    const delta=event.data.delta;
                    assistantReply+=delta;
                    controller.enqueue(encodeEvent({type:"text",delta:delta}))
                }
               }
               await agentStream.completed;
               await saveAssistantMessage(conversationId,assistantReply,activeAgentName,toolUsed)
            }catch(error){
                controller.error(error);}
            finally{
                controller.close();}
    }});
}