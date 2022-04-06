import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

const app = express()
app.use(express.static(path.join(__dirname, '..', 'public')))

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
})

instrument(io, {
  auth: false,
});

export { httpServer, io }