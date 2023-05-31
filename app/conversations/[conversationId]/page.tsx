import getConversationById from "@/app/actions/getConversationById"
import getMesseges from "@/app/actions/getMesseges"
import EmptyState from "@/app/components/EmptyState"
import Header from "./components/Header"
import Body from "./components/Body"
import Form from "./components/Form"

type Props = {
    params: {
        conversationId: string
    }
}

export default async function Conversation({ params: { conversationId } }: Props) {
    const conversation = await getConversationById(conversationId);
    const messages = await getMesseges(conversationId);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    )
}