import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

interface Params {
    params: {
        conversationId?: string
    }
}

export async function POST(req: Request, { params: { conversationId } }: Params) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unathorized', { status: 401 });

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messeges: {
                    include: {
                        seens: true
                    }
                },
                users: true
            },
        });

        if (!conversation) return new NextResponse('Invalid ID', { status: 400 });

        const lastMessage = conversation.messeges[conversation.messeges.length - 1];

        if (!lastMessage) return NextResponse.json(conversation);

        const updatedMessage = await prisma.messege.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seens: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                seens: true,
                sender: true
            }
        })

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messeges: [updatedMessage]
        })

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage)

        return NextResponse.json(updatedMessage);
    } catch (error: any) {
        console.log(error, 'ERROR_MESSEGES')
        return new NextResponse('Internal Error', { status: 500 })
    }
}