const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.admin) {
      return response.status(401).json({ error: 'no admin rights' })
    }

    const users = await User.find({})
    return response.json(users.map(user => user.toJSON()))
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request

    if (body.password.length < 6 || body.username.length < 3) {
      return response.status(400).json({ error: 'credential requirements not fulfilled ' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      admin: body.admin ? body.admin : false,
      passwordHash,
    })

    console.log(user)
    const savedUser = await user.save()

    return response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

module.exports = usersRouter
