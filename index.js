const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require('dotenv')

dotenv.config()
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
  if (message.content === '/join') {
    if (!gameStarted) {
      if (players.size < 5) {
        players.set(message.author, 0) // Setting the initial position
        message.channel.send(`${message.author.username} has joined the game!`)
        if (players.size == 5) {
          message.channel.send(
            `The game is ready to start! please use !start to start the game!`,
          )
        }
      } else {
        message.channel.send('The game is full, please try again later.')
      }
    } else {
      message.channel.send(
        'The game has already started, please wait for the next round.',
      )
    }
  }

  if (message.content === '/start') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (players.size >= 5 && !gameStarted) {
        gameStarted = true
        message.channel.send("The game has started, let's roll the dices!")
      } else {
        message.channel.send(
          'The game has already started or not enough players, please wait for the next round.',
        )
      }
    } else {
      message.channel.send('You do not have the permission to start the game.')
    }
  }

  if (message.content === '/roll') {
    if (gameStarted && players.has(message.author)) {
      const roll = Math.floor(Math.random() * 6) + 1
      let newPosition = players.get(message.author) + roll
      if (newPosition > 62) newPosition = 62
      players.set(message.author, newPosition)
      message.channel.send(
        `${message.author.username} rolls... ${roll}, and moved to position ${newPosition}!`,
      )
    } else if (!gameStarted) {
      message.channel.send(
        "The game hasn't started yet, please wait for the admin to start the game.",
      )
    } else {
      message.channel.send(
        "You are not in the game! Please use '!join' to join the game!",
      )
    }
  }

  if (message.content === '/leave') {
    if (players.has(message.author)) {
      players.delete(message.author)
      message.channel.send(`${message.author.username} has left the game.`)
      if (players.size < 5 && gameStarted) gameStarted = false
    } else {
      message.channel.send('You are not in the game!')
    }
  }
})

client.login(process.env.TOKEN)
