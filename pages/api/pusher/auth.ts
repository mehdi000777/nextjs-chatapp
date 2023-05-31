import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const sesstion = await getServerSession(req, res, authOptions);

    if (!sesstion?.user?.email) return res.status(401);

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const data = {
        user_id: sesstion?.user?.email
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return res.send(authResponse);
}