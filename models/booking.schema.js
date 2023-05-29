const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
    customerEmail: {
        required: true,
        type: String
    },
    startDate: {
        required: true,
        type: String
    },
    startTime: {
        required: true,
        type: String
    },
    players: {
        required: true,
        type: [{ shoeSize: Number }]
    },
    lanes: {
        required: true,
        type: [ Number ]
    },
    totalPrice: {
        required: true,
        type: Number
    },
    bookingNumber: {
        required: true,
        type: String,
        default: () => {
            return uuidv4(20)
        }
    },
    createdAt: {
        required: true,
        type: String,
        default: () => {
            return new Date().toLocaleString()
        }
    },
    modifiedAt: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model("Booking", bookingSchema)
