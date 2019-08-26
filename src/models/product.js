const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema)

module.exports = Product
