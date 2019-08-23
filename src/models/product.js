const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = mongoose.Schema({
  price: Number,
  details: {
    title: String,
    description: String,
    date_added: Date,
  },
})

productSchema.plugin(uniqueValidator)

const Product = mongoose.model('Product', productSchema)

module.exports = Product