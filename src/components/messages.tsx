import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages } from "../http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessagesWebsockets } from "../hooks/use-messages-websockets";

export function Messages() {
  const { roomId } = useParams()
  if (!roomId) throw new Error("Unknown roomId")

  const { data } = useSuspenseQuery({
    queryFn: () => getRoomMessages({ roomId }),
    queryKey: ['messages', roomId]
  })

  useMessagesWebsockets({ roomId })

  const sortedMessages = data.messages.sort((a, b) => b.amountOfReactions - a.amountOfReactions)

  return (
    <ol className="list-decimal list-outside px-3 space-y-8 ">
      {sortedMessages.map((message) => (
        <Message key={message.id} id={message.id} text={message.text} answered={message.answered} amountOfReactions={message.amountOfReactions} />
      ))}
    </ol>
    )
}
