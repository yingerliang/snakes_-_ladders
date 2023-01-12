const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const dotenv = require('dotenv')
dotenv.config()

let gameStarted = false
let round = 0
let currentPlayer = null

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
  if (message.content === '/join') {
    console.log(message.content)
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
          'The game has already started or there are not enough players, please wait for the next round.',
        )
      }
    } else {
      message.channel.send('You do not have the permission to start the game.')
    }
  }

  if (message.content === '/roll' && gameStarted) {
    if (round === 0 || message.author === currentPlayer) {
      let roll = Math.floor(Math.random() * 6) + 1
      message.channel.send(`${message.author.username} rolls... ${roll}!`)
      round += 1
      currentPlayer = message.author
      if (round === players.size) {
        round = 0
        let maxRoll = 0
        // Find the highest roll
        for (let [player, roll] of players) {
          if (roll > maxRoll) {
            maxRoll = roll
            currentPlayer = player
          }
        }
        message.channel.send(
          `${currentPlayer.username} has the highest roll ${maxRoll} and will go first`,
        )
      }
    } else {
      message.channel.send(
        `It's ${currentPlayer.username} turn to roll, please wait your turn`,
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
