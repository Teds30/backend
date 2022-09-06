const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Booking = new Schema(
    {
        booking_dates: {
            from: {
                type: Date,
                required: true,
            },
            to: {
                type: Date,
                required: true,
            },
        },
        customer: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Customers',
            required: false,
        },
        car: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Cars',
            required: false,
        },
        total_amount: {
            type: Number,
            required: false,
            default: 0,
        },
        status: {
            type: String,
            default: 'pending',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Bookings', Booking)
