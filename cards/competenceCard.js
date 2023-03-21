module.exports = {
  getCompetenceCard: function (id) {
    switch (id) {
      case 1:
        return 'Have each of your group members name one competence of yours! (If you don‘t know each other yet, let them name a competence that they think you could have based on their first impression)!'
      case 2:
        return 'Let everyone share their achievement of the day!'
      case 3:
        return 'Feeling competent within your studies is important for your well-being. Do you agree or disagree? Why?'
      case 4:
        return 'Andecdote: Tell a story related to Comptence"TABOO Take a few moments to think of a word in the category below. Then, describe the word without using it or mentioning the category to the other players and let them guess. If they guessed it within 60 seconds, you may keep the card. * Something you feel really capable of *'
      default:
        return 'Invalid card ID'
    }
  },
}
