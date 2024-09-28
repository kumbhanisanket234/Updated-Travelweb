const mongoose = require('mongoose')

const OrderDetailsSchema = new mongoose.Schema({
    title: String,
    adults: String,
    children: String,
    birthDate: String,
    departureCity: String,
    destination:String,
    departureDate: String,
    email: String,
    fname: String,
    lname: String,
    phone: String,
    returnDate: String,
    totalCost:Number,
    cardNumber:String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to UserModel
        required: true // Make sure to require the user field
    }
})

const OrderDetailsModel = mongoose.model('OrderDetails', OrderDetailsSchema)
module.exports = OrderDetailsModel;