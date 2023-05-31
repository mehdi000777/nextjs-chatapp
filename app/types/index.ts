import { Conversation, Messege, User } from "@prisma/client";


export type fullMessageType = Messege & {
    sender: User,
    seens: User[]
}

export type fullConversationType = Conversation & {
    users: User[],
    messeges: fullMessageType[]
}