import prisma from '@/app/libs/prismadb';
import getSession from './getSesstion';

const getUsers = async () => {
    const sesstion = await getSession();

    if (!sesstion?.user?.email) return [];

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: sesstion.user.email
                }
            }
        })

        return users;
    } catch (error: any) {
        return [];
    }
}

export default getUsers;