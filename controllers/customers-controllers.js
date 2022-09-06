const Customer = require('../models/customers-schema.js')

const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error.js')

const fetchCustomers = async (req, res, next) => {
    let customers
    try {
        customers = await Customer.find({})
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a customer.',
            500
        )
        return next(error)
    }

    if (!customers) {
        const error = new HttpError(
            'Could not find customer for the provided id.',
            404
        )
        return next(error)
    }

    res.json(customers)
}

exports.fetchCustomers = fetchCustomers
