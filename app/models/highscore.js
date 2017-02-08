var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HighscoreSchema = new Schema({
    name: String,
    points: Number,
    group: String
});

module.exports = mongoose.model('Highscore', HighscoreSchema);
