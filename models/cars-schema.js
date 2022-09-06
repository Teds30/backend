const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Car = new Schema({
    image: {
        type: String,
        default: null,
        required: false,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        min: 1,
        required: false,
    },
    transmission: {
        type: String,
        required: false,
    },
    isAvailable: Boolean,
    dailyRate: {
        type: Number,
        required: false,
    },
    pickup_location: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Center',
        required: false,
        default: null,
    },
})

module.exports = mongoose.model('Cars', Car)
