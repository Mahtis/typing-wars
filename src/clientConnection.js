import _io from 'socket.io-client'

export const dependencies = {
  io: _io
}

const { BACKEND_URL } = process.env

const clientConnection = () => {
  let socket;

  const getRoomName = () => {
    const path = document.location.pathname.split('/')
    const roomPathIndex = path.findIndex(item => item === 'room') + 1
    return path[roomPathIndex]
  }

  const initConnection = () => {
    const room = getRoomName();

    socket = dependencies.io(BACKEND_URL)
    socket.emit('joinroom', room);
    
    socket.on('msg', msg => {
      console.log('hello hellooooo')
      const li = document.createElement('li')
      const text = document.createTextNode(msg)
      li.appendChild(text)
      messages.appendChild(li)
    })

    socket.on('error', error => console.log(error))
  }

  const getSocket = () => socket

  const sendMessage = message => {
    socket.emit('msg', message)
  }
  
  return { getSocket, initConnection, sendMessage }
}

export default clientConnection
