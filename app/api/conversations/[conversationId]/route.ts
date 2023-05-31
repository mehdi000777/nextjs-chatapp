import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface Params {
    params: {
        conversationId: string
    }
}

export async function DELETE(req: Request, { params: { conversationId } }: Params) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unathorizd', { status: 401 });

        if (!conversationId) return new NextResponse('Invalid Data', { status: 400 });

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if (!existingConversation) return new NextResponse('Invalid Data', { status: 400 });

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        existingConversation.users.forEach(user => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation);
    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION')
        return new NextResponse('Internal Error', { status: 500 })
    }
}