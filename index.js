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

let autonomyCompleted = false
let relatednessCompleted = false
let competenceCompleted = false

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

  // Roll Dice Command
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
        if (players.get(message.author) === 62) {
          if (
            !autonomyCompleted ||
            !relatednessCompleted ||
            !competenceCompleted
          ) {
            message.channel.send(
              `${message.author.username} has not collected all the cards, going back to Week 1, Position 1.`,
            )
            players.set(message.author, 1)
          } else {
            message.channel.send(
              `Congratulations ${message.author.username}! You've collected all the cards!`,
            )
            gameStarted = false
            players.clear()
            rolling = false
            round = 0
            firstRound = true
            autonomyCompleted = false
            relatednessCompleted = false
            competenceCompleted = false
          }
        }

        // Position 8 slides to Position 53
        if (players.get(message.author) === 8) {
          message.channel.send(
            `${message.author.username} has landed on position 8 and is now sliding down to position 53.`,
          )
          players.set(message.author, 53)
        }

        // Position 25 climbs back to Position 11
        if (players.get(message.author) === 25) {
          message.channel.send(
            `${message.author.username} has landed on position 8 and is now climbing up the ladder back to position 11.`,
          )
          players.set(message.author, 11)
        }

        // Position 21 climbs back to Position 16
        if (players.get(message.author) === 21) {
          message.channel.send(
            `${message.author.username} has landed on position 21 and is taking 5 steps back to position 16.`,
          )
          players.set(message.author, 16)
        }

        // Position 37 flies to Position 44
        if (players.get(message.author) === 37) {
          message.channel.send(
            `${message.author.username} has landed on position 37 and flies to position 44.`,
          )
          players.set(message.author, 44)
        }

        // Position 56 climbs back to Position 50
        if (players.get(message.author) === 56) {
          message.channel.send(
            `${message.author.username} has landed on position 56 and had an extra long weekend back to position 50.`,
          )
          players.set(message.author, 50)
        }

        // Position 60 goes to Position 1
        if (players.get(message.author) === 60) {
          message.channel.send(
            `${message.author.username} has landed on position 60 and is finished for the week. Go to position 1.`,
          )
          players.set(message.author, 1)
        }

        // Position 13 = Roll again
        if (players.get(message.author) === 13) {
          message.channel.send(
            `${message.author.username} has landed on position 13 and will roll again.`,
          )
          let roll = Math.floor(Math.random() * 6) + 1
          let newPosition = players.get(message.author) + roll
          players.set(message.author, newPosition)
          message.channel.send(
            `${message.author.username} has rolled a ${roll} and landed on position ${newPosition}`,
          )
        }

        // Position 32 = Skip next turn
        let skipNextTurn = new Map()

        if (players.get(message.author) === 32) {
          message.channel.send(
            `${message.author.username} has landed on position 32 and will skip their next turn.`,
          )
          skipNextTurn.set(message.author, true)
        }

        if (skipNextTurn.get(message.author)) {
          message.channel.send(
            `${message.author.username} has to skip this turn`,
          )
          skipNextTurn.set(message.author, false)
          return
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
          let cardId = Math.floor(Math.random() * 3) + 1 // change number depending on cards added
          message.channel.send(
            `${message.author.username} drew an Autonomy card!`,
          )
          message.channel.send(
            `Objective: ${anatomyCard.getAnatomyCard(cardId)}`,
          )
          autonomyCompleted = true
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
          let cardId = Math.floor(Math.random() * 3) + 1 // change number depending on cards added
          message.channel.send(
            `${message.author.username} drew an Competence card!`,
          )
          message.channel.send(
            `Task: ${competenceCard.getCompetenceCard(cardId)}`,
          )
          competenceCompleted = true
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
          let cardId = Math.floor(Math.random() * 3) + 1 // change number depending on cards added
          message.channel.send(
            `${message.author.username} drew an Relatedness card!`,
          )
          message.channel.send(
            `Objective: ${relatednessCard.getRelatednessCard(cardId)}`,
          )
          relatednessCompleted = true
        }

        // Send message when cards have been collected
        if (autonomyCompleted && relatednessCompleted && competenceCompleted) {
          message.channel.send(
            `Congratulations ${message.author.username}! You've collected all the cards!`,
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

  // Track cards collected
  if (message.content === '/cards') {
    let cards = []
    if (autonomyCompleted) cards.push('Autonomy')
    if (relatednessCompleted) cards.push('Relatedness')
    if (competenceCompleted) cards.push('Competence')

    if (cards.length > 0) {
      message.channel.send(
        `${message.author.username}, you've collected: ${cards.join(', ')}`,
      )
    } else {
      message.channel.send(
        `${message.author.username}, you haven't collected any cards yet.`,
      )
    }
  }

  // Skip card
  if (message.content.startsWith('!skip')) {
    let card = message.content.split(' ')[1]
    if (card === 'autonomy') {
      autonomyCompleted = true
      message.channel.send(
        `${message.author.username}, You have skipped the Autonomy card.`,
      )
    } else if (card === 'relatedness') {
      relatednessCompleted = true
      message.channel.send(
        `${message.author.username}, You have skipped the Relatedness card.`,
      )
    } else if (card === 'competence') {
      competenceCompleted = true
      message.channel.send(
        `${message.author.username}, You have skipped the Competence card.`,
      )
    } else {
      message.channel.send(
        `${message.author.username}, Invalid card name. Please use 'autonomy', 'relatedness' or 'competence'.`,
      )
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
