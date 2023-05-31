import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { name, image } = body;

        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unathorized', { status: 401 });

        if (!name && !image) return new NextResponse('Invalid Data', { status: 400 });

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser?.id
            },
            data: {
                name,
                image
            }
        })

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.log(error, 'ERROR_SETTINGS');
        return new NextResponse('Internal Error', { status: 500 });
    }
}