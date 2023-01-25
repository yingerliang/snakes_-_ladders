const anatomyCard = require('./cards/anatomyCard')
const competenceCard = require('./cards/competenceCard')
const relatednessCard = require('./cards/relatednessCard')

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
const dotenv = require('dotenv')
dotenv.config()

let gameStarted = false
let round = 0
let currentPlayer = null
let maxRoll = 0
let rolling = false
let firstRound = true
const players = new Map() //map to store players position

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', (message) => {
  // Let players join with command
  if (message.content === '/join') {
    if (!gameStarted) {
      if (players.size <= 5) {
        players.set(message.author, 0) // Setting the initial position
        message.channel.send(`${message.author.username} has joined the game!`)
        if (players.size == 1) {
          message.channel.send(
            `The game is ready to start! please use /start to start the game!`,
          )
        }
      } else {
        // No more than 5 players
        message.channel.send('The game is full, please try again later.')
      }
    } else {
      message.channel.send(
        'The game has already started, please wait for the next round.',
      )
    }
  }

  // Start game - only Admin can start
  if (message.content === '/start') {
    if (!gameStarted) {
      if (message.member.permissions.has('ADMINISTRATOR')) {
        if (players.size >= 1 && !gameStarted) {
          gameStarted = true
          message.channel.send("The game has started, let's roll the dices!")
        } else {
          message.channel.send(
            'The game has already started or there are not enough players, please wait for the next round.',
          )
        }
      } else {
        message.channel.send(
          'You do not have the permission to start the game.',
        )
      }
    }
  }

  // Roll Command
  if (message.content === '/roll' && gameStarted) {
    if (round === 0 || message.author === currentPlayer) {
      // Roll Double Dice
      if (rolling) {
        let rolls = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]
        let totalRoll = rolls.reduce((a, b) => a + b)
        players.set(message.author, players.get(message.author) + totalRoll)
        // Player Roll
        message.channel.send(
          `${message.author.username} rolls... ${rolls[0]} + ${rolls[1]} = ${totalRoll}!`,
        )
        // Update player position
        message.channel.send(
          `${message.author.username} is now at position ${players.get(
            message.author,
          )}`,
        )
        if (players.get(message.author) >= 62) {
          message.channel.send(
            `Congratulations ${message.author.username}! You've won the game!`,
          )
          gameStarted = false
          players.clear()
          rolling = false
          round = 0
          firstRound = true
        }

        // Draw Anatomy Card
        if (
          players.get(message.author) === 3 ||
          players.get(message.author) === 4 ||
          players.get(message.author) === 9 ||
          players.get(message.author) === 28 ||
          players.get(message.author) === 33 ||
          players.get(message.author) === 36 ||
          players.get(message.author) === 58
        ) {
          let cardId = Math.floor(Math.random() * 3) + 1 // generate a random card ID between 1 and 3
          message.channel.send(
            `${message.author.username} drew an Autonomy card!`,
          )
          message.channel.send(
            `Objective: ${anatomyCard.getAnatomyCard(cardId)}`,
          )
        }

        // Draw Competence Card
        if (
          players.get(message.author) === 11 ||
          players.get(message.author) === 15 ||
          players.get(message.author) === 17 ||
          players.get(message.author) === 39 ||
          players.get(message.author) === 40 ||
          players.get(message.author) === 43 ||
          players.get(message.author) === 61
        ) {
          let cardId = Math.floor(Math.random() * 3) + 1 // generate a random card ID between 1 and 3
          message.channel.send(
            `${message.author.username} drew an Competence card!`,
          )
          message.channel.send(
            `Task: ${competenceCard.getCompetenceCard(cardId)}`,
          )
        }

        // Draw Relatedness Card
        if (
          players.get(message.author) === 22 ||
          players.get(message.author) === 23 ||
          players.get(message.author) === 27 ||
          players.get(message.author) === 46 ||
          players.get(message.author) === 50 ||
          players.get(message.author) === 53 ||
          players.get(message.author) === 62
        ) {
          let cardId = Math.floor(Math.random() * 3) + 1 // generate a random card ID between 1 and 3
          message.channel.send(
            `${message.author.username} drew an Relatedness card!`,
          )
          message.channel.send(
            `Objective: ${relatednessCard.getRelatednessCard(cardId)}`,
          )
        }

        round += 1
        if (round === players.size) {
          round = 0
        }
      } else {
        let rolls = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]
        let totalRoll = rolls.reduce((a, b) => a + b)
        message.channel.send(
          `${message.author.username} rolls... ${rolls[0]} + ${rolls[1]} = ${totalRoll}!`,
        )
        if (totalRoll > maxRoll) {
          maxRoll = totalRoll
          currentPlayer = message.author
          if (firstRound) {
            message.channel.send(
              `${currentPlayer.username} has the highest roll ${maxRoll} and will roll again`,
            )
            firstRound = false
          }
          rolling = true
        } else {
          message.channel.send(`It's not your turn ${message.author.username}`)
        }
      }
    } else {
      message.channel.send(`It's not your turn ${message.author.username}`)
    }
  }

  // Leave the game if needed
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
