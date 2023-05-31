'use client'

import useConversation from "@/app/hooks/useConversation";
import { fullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from 'react';
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

type Props = {
    initialMessages: fullMessageType[]
}

export default function Body({ initialMessages }: Props) {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

        const messageHandler = (message: fullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message]
            })
        }

        const updateMessageHandler = (newMessage: fullMessageType) => {
            setMessages(current => current.map(currentMessage => {
                if (currentMessage.id === newMessage.id) return newMessage;

                return currentMessage;
            }))
        }

        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler)

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler);
            pusherClient.unbind('message:update', updateMessageHandler);
        }
    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto">
            {
                messages.map((message, index) => (
                    <MessageBox
                        key={message.id}
                        data={message}
                        isLast={index === messages.length - 1}
                    />
                ))
            }
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}
