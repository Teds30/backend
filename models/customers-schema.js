const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Customer = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
})

module.exports = mongoose.model('Customers', Customer)
