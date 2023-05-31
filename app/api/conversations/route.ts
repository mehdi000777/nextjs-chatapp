import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const { userId, isGroup, members, name } = body;

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unathorized', { status: 401 });

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    group: isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            newConversation.users.forEach(user => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation)
                }
            })

            return NextResponse.json(newConversation);
        }

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    {
                        userIds: { equals: [currentUser.id, userId] }
                    },
                    {
                        userIds: { equals: [userId, currentUser.id] }
                    }
                ]
            }
        })

        if (existingConversation) {
            return NextResponse.json(existingConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: userId
                        },
                        {
                            id: currentUser.id
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        newConversation.users.forEach(user => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation);
            }
        })

        return NextResponse.json(newConversation);
    } catch (error: any) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}