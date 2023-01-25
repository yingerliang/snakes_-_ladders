module.exports = {
  getRelatednessCard: function (id) {
    switch (id) {
      case 1:
        return 'Pictionary: Draw a cat'
      case 2:
        return 'Charades: Depict a dog'
      case 3:
        return 'Taboo: Explain the word - Relatedness'
      case 4:
        return 'Andecdote: Tell a story related to Relatedness'
      default:
        return 'Invalid card ID'
    }
  },
}
