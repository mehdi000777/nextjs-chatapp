import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser.email) return [];

        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessegeAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messeges: {
                    include: {
                        sender: true,
                        seens: true
                    }
                }
            }
        })

        return conversations;
    } catch (error: any) {
        return [];
    }
}

export default getConversations;