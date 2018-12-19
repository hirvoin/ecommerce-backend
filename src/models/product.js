const mongoose = require('mongoose')

const Product = mongoose.model('Product', {
  sku: String,
  type: String,
  price: Number,
  details: {
    title: String,
    description: String,
    date_added: Date,
  },
})

module.exports = Product
