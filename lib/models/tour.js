const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  activities: [{
    type: String,
    required: false
  }],
  launchDate: {
    type: Date,
    default: () => new Date()
  },
  stops: [{
    address: String
  }]
});

module.exports = mongoose.model('Tour', schema);