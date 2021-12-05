const mongoose = require('mongoose')

const games_emoji = new mongoose.Schema({
  emoji: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
}, { collection: 'game_emoji' })

module.exports = mongoose.model('GamesEmoji', games_emoji)