const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const accountSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        default: 'demo'
    }
})

accountSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Account', accountSchema)
