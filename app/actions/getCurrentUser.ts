import prisma from '@/app/libs/prismadb';
import getSession from './getSesstion';


const getCurrentUser = async () => {
    try {
        const sesstion = await getSession();

        if (!sesstion?.user?.email) return null;

        const currentUser = await prisma.user.findUnique({
            where: {
                email: sesstion?.user?.email as string
            }
        })

        if (!currentUser) return null;

        return currentUser;
    } catch (error: any) {
        return null;
    }
} 

export default getCurrentUser;