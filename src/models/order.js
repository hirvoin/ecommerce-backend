const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      required: true,
      type: Object,
    },
  ],
  date: Date,
  totalPrice: {
    required: true,
    type: Number,
  },
  deliveryAddress: {
    name: String,
    street: String,
    zipCode: String,
    city: String,
    country: String,
  },
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
