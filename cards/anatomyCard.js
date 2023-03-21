module.exports = {
  getAnatomyCard: function (id) {
    switch (id) {
      case 1:
        return 'Let your group members make three request to you and answer ‚no!‘ to all of them.'
      case 2:
        return 'Let everyone name one course that you find that interesting that you would want to add it to your course curriculum!'
      case 3:
        return 'What needs to happen in a course for you see a meaning and value behind what you learn?'
      case 4:
        return 'Tell the others about a situation when you felt heard by your teacher(s)!'
      default:
        return 'Invalid card ID'
    }
  },
}
