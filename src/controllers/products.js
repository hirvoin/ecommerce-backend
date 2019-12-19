const jwt = require('jsonwebtoken')
const productsRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')
const FeaturedProduct = require('../models/featuredProduct')

const formatProduct = product => ({
  _id: product._id,
  type: product.type,
  title: product.title,
  description: product.description,
  price: product.price,
  // image: product.details.image,
})

productsRouter.get('/', async (request, response) => {
  try {
    const products = await Product.find({})
    return response.json(products.map(formatProduct)).status(200)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.get('/featured', async (request, response) => {
  try {
    const featuredProducts = await FeaturedProduct.find({})
    return response.json(featuredProducts.map(formatProduct)).status(200)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.get('/:id', async (request, response) => {
  try {
    const product = await Product.findById(request.params.id)
    console.log(product)
    return response.json(formatProduct(product)).status(201)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    const { body } = request

    const product = new Product({
      type: body.type,
      price: body.price,
      title: body.title,
      description: body.description,
      image: body.image,
    })

    console.log(product)

    const savedProduct = await product.save()

    return response.status(201).json(formatProduct(savedProduct))
  } catch (error) {
    console.log(error)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.put('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    const { body } = request
    const product = {
      type: body.type,
      price: body.price,
      title: body.title,
      description: body.description,
      image: body.image,
    }

    const saved = await Product.findByIdAndUpdate(request.params.id, product, { new: true })
    console.log(saved)
    return response.status(200).json(formatProduct(product))
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    await Product.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.post('/featured', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const { featuredProducts } = request.body

    if (!user.admin) {
      return response.status(403).json({ error: 'no admin rights' })
    }

    await FeaturedProduct.deleteMany({})

    if (featuredProducts.length !== 3) {
      return response.status(200).json({ error: 'featured products must contain three items' })
    }

    console.log('featuredProducts', featuredProducts)

    const savedProducts = featuredProducts.map(async (p) => {
      const product = await Product.findById(p)
      const featuredProduct = new FeaturedProduct({
        type: product.type,
        price: product.price,
        title: product.title,
        description: product.description,
        image: product.image,
      })
      const savedFeaturedProduct = await featuredProduct.save()
      console.log('savedFeaturedProduct', savedFeaturedProduct)
      return savedFeaturedProduct
    })

    console.log('savedProducts', savedProducts)

    return response.json(savedProducts.map(formatProduct)).status(200)
  } catch (error) {
    console.log(error)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

module.exports = productsRouter
