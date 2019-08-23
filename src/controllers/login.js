const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { body } = request
  console.log(body)
  const user = await User.findOne({ username: body.username }).populate({
    path: 'orders',
    populate: {
      path: 'products',
      model: 'Product',
    },
  })

  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(400).send({ error: 'invalid username or password' })
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  return response.status(200).send({
    token,
    _id: user._id,
    username: user.username,
    name: user.name,
    orders: user.orders,
    admin: user.admin,
  })
})

module.exports = loginRouter