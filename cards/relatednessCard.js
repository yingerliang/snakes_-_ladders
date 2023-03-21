module.exports = {
  getRelatednessCard: function (id) {
    switch (id) {
      case 1:
        return 'In turns, let everyone mention one aspect that they believe is important for a good teacher-student relationship!'
      case 2:
        return 'What do you and your group members do or organise to get to know each other or your fellow students better? How could you benefit from each other‘s experiences?'
      case 3:
        return 'Working within a group does not only bring benefits. When working with others, conflicts seem inevitable. When did you encounter such a group conflict within your studies and how did you resolve it together?'
      case 4:
        return 'Are there situations when you feel appreciated by your fellow students and teachers? Does appreciation help you feel more related to them?'
      default:
        return 'Invalid card ID'
    }
  },
}
