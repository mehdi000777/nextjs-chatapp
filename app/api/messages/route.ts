import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser.email) return new NextResponse('Unathorized', { status: 401 });

        const body = await req.json();
        const { message, image, conversationId } = body;

        if ((!message && !image) || !conversationId) return new NextResponse('Invalid data', { status: 400 });

        const newMessage = await prisma.messege.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
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

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessegeAt: new Date(),
                messeges: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messeges: {
                    include: {
                        seens: true
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messeges[updatedConversation.messeges.length - 1];

        updatedConversation.users.map(user => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messeges: [lastMessage]
            })
        })

        return NextResponse.json(newMessage);
    } catch (error: any) {
        console.log(error, "ERROR_MESSAGES")
        return new NextResponse('Internal Error', { status: 500 })
    }
}