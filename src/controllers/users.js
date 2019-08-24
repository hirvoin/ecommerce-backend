const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Order = require('../models/order')

usersRouter.get('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    const users = await User.find({}).populate('orders')

    return response.status(200).json(users.map(u => u.toJSON()))
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user.admin && !decodedToken.id === request.params.id) {
      return response.status(403)
    }

    const userToReturn = await User.findById(decodedToken.id).populate('orders')

    return response.status(200).json(userToReturn)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

// useless after refactoring
usersRouter.get('/:id/orders', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id === request.params.id) {
      return response.status(403)
    }
    const orders = await Order.find({ user: request.params.id }).populate('products')
    return response.status(200).json(orders)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json(exception)
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request

    console.log(body)

    if (body.password.length < 6 || body.username.length < 3) {
      return response.status(400).json({ error: 'credential requirements not fulfilled ' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      email: body.email,
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

usersRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    await User.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'someting went wrong' })
  }
})

module.exports = usersRouter
