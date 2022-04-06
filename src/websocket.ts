import { io } from './http'
import * as jwt from 'jsonwebtoken'

type RoomUser = {
  socket_id: string
  room: string
  username: string
}

type Message = {
  room: string
  username: string
  text: string
  createdAt: Date
}

const users: RoomUser[] = []
const messages: Message[] = []

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token
    const decoded = jwt.verify(token, '123') 
    if (!!decoded) {
      console.log('ENTREI SERVER OK')
      next()
    }
  } catch {
    console.log('ENTREI SERVER ERROR')
    next(new Error("invalid"))
  }
})

io.on('connection', socket => {
  socket.on('select_room', (data, callback) => {
    socket.join(data.room)

    let userInRoom: RoomUser = users.find(user => 
      user.username === data.username &&
      user.room === data.room
    )

    if (userInRoom) {
      userInRoom.socket_id = socket.id
    } else {
      users.push({
        socket_id: socket.id,
        room: data.room,
        username: data.username
      })  
    }

    const messagesRoom = getMessagesRoom(data.room)
    callback(messagesRoom)
  })

  socket.on('message', data => {
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date()
    }

    io.to(data.room).emit('message', message)
  })
})

function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter(message => message.room === room)
  return messagesRoom
}