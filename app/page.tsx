import prisma from "@/lib/db";
import { ChatApp } from "@/modules/chat/components/chat-app";
import { getCurrentUser } from "@/modules/auth/actions";

export default async function Home() {
  const sessionUser = await getCurrentUser();
  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { role: true },
      })
    : null;

  return <ChatApp isAdmin={user?.role === "ADMIN"} />;
}
