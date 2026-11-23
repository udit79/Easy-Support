export async function readChatStream(
    response:Response,
    onUpdate:(fullText:string)=>void
) {
    if(!response.body){
        throw new Error("No response stream.")
    }
    const reader=response.body.getReader();
    const decoder=new TextDecoder();
    let fullText="";

    try {
        while (true) {
            const {done,value}=await reader.read();
            if (done) break;
            const chunk=decoder.decode(value,{stream:true});
            fullText+=chunk;
            onUpdate(fullText);
        }
        return fullText;
    } finally {
        reader.releaseLock();
    }
}