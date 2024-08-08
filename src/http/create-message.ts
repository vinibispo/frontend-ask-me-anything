interface CreateMessageRequest {
  roomId: string
  message: string
}

export async function createMessage({ roomId, message }: CreateMessageRequest) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  const data: { id: string } = await response.json()

  return { messageId: data.id }
}
