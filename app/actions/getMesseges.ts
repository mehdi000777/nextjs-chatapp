import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getMesseges = async (conversationId: string) => {
    try {
        const messeges = await prisma.messege.findMany({
            where: {
                conversationId
            },
            include: {
                seens: true,
                sender: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return messeges;
    } catch (error: any) {
        return [];
    }

}

export default getMesseges;