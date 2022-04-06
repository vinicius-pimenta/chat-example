let socket = io({
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGM4ZTNkNmVlZGZlNGRlYzdkMzU3YiIsImlhdCI6MTY0OTIwMDA1MSwiZXhwIjoxNjUxNzkyMDUxfQ.UFAELxMRhKJ-NSvoAe7rV639XrRLMYrP3klTUMZhv7Q"
  }
})

const urlSearch = new URLSearchParams(window.location.search)
const username = urlSearch.get('username')
const room = urlSearch.get('select_room')

const usernameDiv = document.getElementById('username')
usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`

document.getElementById('connectButton').addEventListener('click', event => { 
  socket.emit('select_room', {
    username,
    room
  }, messages => {
    messages.forEach(message => createMessage(message))
  })
  socket.auth.token = 'tokenInvalido'
  socket.connect()
  console.log('CONECTADO')
})

document.getElementById('disconnectButton').addEventListener('click', event => {
  socket.disconnect()
  console.log('DESCONECTADO')
})

socket.on("connect_error", (err) => {
  console.log('ENTREI CLIENT ERROR')
  console.log(err.message); // prints the message associated with the error
});

socket.emit('select_room', {
  username,
  room
}, messages => {
  messages.forEach(message => createMessage(message))
})

document
  .getElementById('message_input')
  .addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const message = event.target.value
      
      const data = {
        room,
        username,
        message
      }

      socket.emit('message', data)
      
      event.target.value = ''
    }
  })

socket.on('message', data => {
  createMessage(data)
})

function createMessage(data) {
  const messageDiv = document.getElementById('messages')

  messageDiv.innerHTML += `
    <div class="new_message">
      <label class="form-label">
        <strong> ${data.username} </strong> <span> ${data.text} - ${dayjs(
          data.createdAt).format("DD/MM HH:mm")} </span>
      </label>
    </div>
  `
}

document.getElementById('logout').addEventListener('click', event => {
  window.location.href = 'index.html'
})