import io from 'socket.io-client'

const socket = io('/room1')

const form = document.getElementById('form')
const m = document.getElementById('m')
const messages = document.getElementById('messages')

form.addEventListener('submit', e => {
  e.preventDefault()
  console.log('hello')
  socket.emit('msg', m.value)
  m.value = ''
})

// export const submitMessage = e => {
//   console.log('hello hello')
//   e.preventDefault()
//   socket.emit('msg', m.value)
//   m.value = ''
// }

// const socket = io('/room1')
socket.on('msg', msg => {
  console.log('hello hellooooo')
  const li = document.createElement('li')
  const text = document.createTextNode(msg)
  li.appendChild(text)
  messages.appendChild(li)
})

