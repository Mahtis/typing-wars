// import io from 'socket.io-client'
import clientConnection from './clientConnection'
import keyHandler from './keyHandler'
import gameBoard from './gameBoard'
import stringState from './stringState'

const connection = clientConnection()
connection.initConnection()


const initialWords = ['hello', 'world', 'yksi', 'kaksi', 'kolme']

const socket = connection.getSocket()
const state = stringState(initialWords, connection)
const handler = keyHandler(state.updateString)

const canvas = document.getElementById('game')
const board = gameBoard(canvas, state);
board.initBoard();

document.addEventListener('keydown', handler.keyDownHandler)

setInterval(board.draw, 20)

