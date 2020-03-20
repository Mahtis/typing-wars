import io from 'socket.io-client'

const path = document.location.pathname.split('/')
const roomPathIndex = path.findIndex(item => item === 'room')
const room = '/' + path[roomPathIndex] + path[roomPathIndex + 1]
const socket = io(room)
console.log(room)

const form = document.getElementById('form')
const m = document.getElementById('m')
const messages = document.getElementById('messages')

form.addEventListener('submit', e => {
  e.preventDefault()
  console.log('hello')
  socket.emit('msg', m.value)
  m.value = ''
})

socket.on('msg', msg => {
  console.log('hello hellooooo')
  const li = document.createElement('li')
  const text = document.createTextNode(msg)
  li.appendChild(text)
  messages.appendChild(li)
})

