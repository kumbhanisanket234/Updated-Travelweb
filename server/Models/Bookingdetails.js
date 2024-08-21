const mongoose = require("mongoose")

const BookingdetailsSchema = new mongoose.Schema({
    location: String,
    description:String,
    duration:Number,
    facilities:[]
}, { timestamps: true });

const BookingdetailsModel = mongoose.model('Bookingdetails', BookingdetailsSchema);
module.exports = BookingdetailsModel;