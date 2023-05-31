'use client'

import useConversation from "@/app/hooks/useConversation";
import { fullConversationType, fullMessageType } from "@/app/types"
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { curry, find } from "lodash";

interface Props {
    initialItems: fullConversationType[],
    users: User[]
}

export default function ConversationList({ initialItems, users }: Props) {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const sesstion = useSession();

    const router = useRouter();

    const { isOpen, conversationId } = useConversation();

    const pusherKey = useMemo(() => {
        return sesstion.data?.user?.email;
    }, [sesstion.data?.user?.email])

    useEffect(() => {
        if (!pusherKey) return;
        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: fullConversationType) => {
            setItems(current => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }

                return [...current, conversation];
            })
        }

        const conversationUpdateHandler = (newConversation: fullConversationType) => {
            setItems(current => current.map(currentConversation => {
                if (currentConversation.id === newConversation.id) {
                    return {
                        ...currentConversation,
                        messeges: newConversation.messeges
                    }
                }

                return currentConversation;
            }))
        }

        const conversationRemoveHandler = (conversation: fullConversationType) => {
            setItems(current => {
                return [...current.filter(item => item.id !== conversation.id)]
            })

            if (conversationId === conversation.id) router.push('/conversations');
        }

        pusherClient.bind('conversation:new', newHandler);
        pusherClient.bind('conversation:update', conversationUpdateHandler);
        pusherClient.bind('conversation:remove', conversationRemoveHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newHandler);
            pusherClient.unbind('conversation:update', conversationUpdateHandler);
            pusherClient.unbind('conversation:remove', conversationRemoveHandler);
        }
    }, [pusherKey, conversationId, router])

    return (
        <>
            <GroupChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
            />
            <aside className={clsx("fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
                isOpen ? 'hidden' : 'block w-full left-0'
            )}>
                <div className="px-5">
                    <div className="flex justify-between items-center mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messeges
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {
                        items.map(item => (
                            <ConversationBox
                                key={item.id}
                                data={item}
                                selected={conversationId === item.id}
                            />
                        ))
                    }
                </div>
            </aside>
        </>
    )
}
