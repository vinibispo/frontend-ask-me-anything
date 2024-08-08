import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { GetRoomMessagesResponse } from "../http/get-room-messages"

interface UseMessagesWebsocketsParams {
  roomId: string
}
type WebSocketMessage = {
  kind: 'message_created',
  value: {
    id: string
    text: string
  }
} | {
  kind: 'message_answered',
  value: {
    id: string
  }
} | {
  kind: 'message_reaction_increased' | 'message_reaction_decreased',
  value: {
    id: string
    count: number
  }
}
export function useMessagesWebsockets({ roomId }: UseMessagesWebsocketsParams) {
  const queryClient = useQueryClient()
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)
    ws.onopen = () => {
      console.log('WebSocket connection established')
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    ws.onmessage = (event) => {
      const data : WebSocketMessage = JSON.parse(event.data)
      switch (data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (oldData) => {
            return {
              messages: [
                ...(oldData?.messages || []),
                {
                  id: data.value.id,
                  text: data.value.text,
                  answered: false,
                  amountOfReactions: 0,
                }
              ]
            }
          })
          break
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (state) => {
          if (!state) return undefined

          return {
            messages: state.messages.map((message) => {
              if (message.id === data.value.id) {
                return {
                  ...message,
                  answered: true
                }
              }
              return message
            })
          }
        })
        break
        case 'message_reaction_increased':
        case 'message_reaction_decreased':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (state) => {
            if (!state) return undefined

            return {
              messages: state.messages.map((message) => {
                if (message.id === data.value.id) {
                  return {
                    ...message,
                    amountOfReactions: data.value.count
                  }
                }
                return message
              })
            }
          })
          break
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient])
}
