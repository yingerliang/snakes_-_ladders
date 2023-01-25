module.exports = {
  getCompetenceCard: function (id) {
    switch (id) {
      case 1:
        return 'Pictionary: Draw a cat'
      case 2:
        return 'Charades: Depict a dog'
      case 3:
        return 'Taboo: Explain the word - Competence'
      case 4:
        return 'Andecdote: Tell a story related to Comptence'
      default:
        return 'Invalid card ID'
    }
  },
}
