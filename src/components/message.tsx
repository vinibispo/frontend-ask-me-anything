import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";

interface MessageProps {
  id: string
  text: string
  amountOfReactions: number
  answered?: boolean
}
export function Message({
  id: messageId,
  text,
  amountOfReactions,
  answered = false,
} : MessageProps) {
  const { roomId } = useParams()
  if (!roomId) throw new Error("Message must be used inside a Room page")

  const [hasReacted, setHasReacted] = useState(false)

  async function createMessageReactionAction() {
    try {
      if (!roomId) return

      await createMessageReaction({ roomId, messageId })
    } catch (error) {
      toast.error('Falha ao reagir mensagem, tente novamente!')
    }
    setHasReacted(true)
  }

  async function removeMessageReactionAction() {
    try {
      if (!roomId) return

      await removeMessageReaction({ roomId, messageId })
    } catch (error) {
      toast.error('Falha ao remover reação, tente novamente!')
    }
    setHasReacted(false)
  }
  return (
    <li data-answered={answered} className="pl-6 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none">
      {text}
      {hasReacted ? (
        <button
          type="button"
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
          onClick={removeMessageReactionAction}
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button
          type="button"
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
          onClick={createMessageReactionAction}
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      )}
    </li>
  )
}
