"use server";
import prisma from '@/lib/db';
import { requireSession } from '@/modules/auth/actions';
export async function getConversations(){
    const session = await requireSession();
    return prisma.conversation.findMany({
        where:{userId:session.user.id},
        orderBy:{createdAt:"asc"}
    });
}
export async function createConversation(title="new_chat"){
    const session = await requireSession();
    return prisma.conversation.create({
        data:{
            title,
            userId:session.user.id
        }
    });
}
export async function updateConversation(id:string,title:string){
    const session= await requireSession();
    return prisma.conversation.updateMany(
        {
            where:{id,userId:session.user.id},
            data:{title}
        }
    );
};
export async function deleteConversation(id:string){
    const session=await requireSession();
    return prisma.conversation.deleteMany(
        {
            where:{id,userId:session.user.id}
        }
    );
}