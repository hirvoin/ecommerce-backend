const mongoose = require('mongoose')

const featuredProductSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
})

const featuredProduct = mongoose.model('featuredProduct', featuredProductSchema)

module.exports = featuredProduct
