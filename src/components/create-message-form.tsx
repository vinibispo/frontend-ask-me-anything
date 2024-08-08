import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { createMessage } from "../http/create-message";
import { toast } from "sonner";

export function CreateMessageForm() {
  const { roomId } = useParams()
  if (!roomId) throw new Error("CreateMessageForm must be used inside a Room page")
  async function createMessageAction(data: FormData) {
    const message = data.get('message')?.toString()
    if (!message || !roomId) return
    try {
      const { messageId } = await createMessage({ roomId, message })
      console.log(`Message created with id: ${messageId}`)
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao criar a pergunta')
    }
  }
  return (
    <form className='flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1' action={createMessageAction}>
      <input
        type="text"
        name='message'
        placeholder='Qual a sua pergunta?'
        className='flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500'
        autoComplete='off'
      />

      <button
        type="submit"
        className='bg-orange-400 text-orange-950 px-3 py-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500'
      >
        Criar pergunta
        <ArrowRight className='size-4' />
      </button>

    </form>
  )
}
