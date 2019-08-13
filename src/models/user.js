const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    requred: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  passwordHash: String,
  name: {
    type: String,
    requred: true,
  },
  admin: Boolean,
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
