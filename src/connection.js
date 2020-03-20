import io from "socket.io-client"

export default () => {
  const socket = io('/room1')
  return socket
}