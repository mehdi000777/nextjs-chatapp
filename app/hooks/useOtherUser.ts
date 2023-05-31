import { User } from "@prisma/client";
import { fullConversationType } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export default function useOtherUser(conversation: fullConversationType | {
    users: User[]
}) {
    const session = useSession();

    const otherUser = useMemo(() => {
        return conversation.users.filter(user => user.email !== session?.data?.user?.email);
    }, [session?.data?.user?.email, conversation.users])

    return otherUser[0];
}
