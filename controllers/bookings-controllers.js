const Booking = require('../models/bookings-schema.js')

const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error.js')

const fetchBookings = async (req, res, next) => {
    let bookings
    try {
        bookings = await Booking.find({}).populate('car').populate('customer')
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a booking.',
            500
        )
        return next(error)
    }

    if (!bookings) {
        const error = new HttpError(
            'Could not find bookings for the provided id.',
            404
        )
        return next(error)
    }

    res.json(bookings)
}

const fetchBookingById = async (req, res, next) => {
    const { id } = req.params

    let booking
    try {
        booking = await Booking.findById(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a booking.',
            500
        )
        return next(error)
    }

    if (!booking) {
        const error = new HttpError(
            'Could not find booking for the provided id.',
            404
        )
        return next(error)
    }

    res.json({
        booking,
    })
}

const fetchBookingsByStatus = async (req, res, next) => {
    const { status } = req.params

    let bookings
    try {
        bookings = await Booking.find({ status: status })
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find bookings with that status.',
            500
        )
        return next(error)
    }

    if (!bookings) {
        const error = new HttpError(
            'Could not find booking for the provided status.',
            404
        )
        return next(error)
    }

    res.json(bookings)
}

const addBooking = async (req, res, next) => {
    const errors = validationResult(req)

    // console.log(errors)

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const { booking_dates, customer, car } = req.body

    const newBooking = new Booking({
        booking_dates,
        customer,
        car,
    })

    try {
        const response = await newBooking.save()
    } catch (err) {
        const error = new HttpError(
            'Adding booking failed, please try again.',
            500
        )
        return next(error)
    }

    res.status(201).json({
        message: 'Added new booking',
        booking: newBooking,
    })
}

const editBooking = async (req, res, next) => {
    const { id } = req.params
    const { booking_dates, customer, car, status } = req.body

    let booking

    try {
        booking = await Booking.findById(id)

        if (booking_dates) booking.booking_dates = booking_dates
        if (customer) booking.customer = customer
        if (car) booking.car = car
        if (status) booking.status = status

        await booking.save()
    } catch (err) {
        const error = new HttpError(
            'Modifying booking failed, please try again.',
            500
        )
        // console.log(err.message)
        return next(error)
    }

    // const fullInfo = await car.populate('pickup_location')
    // console.log(fullInfo)

    res.json({
        message: 'Booking updated successfully.',
        booking,
    })
}

const deleteBooking = async (req, res, next) => {
    const { id } = req.params

    let booking
    try {
        booking = await Booking.findByIdAndDelete(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete booking.',
            500
        )
    }

    if (!booking) {
        res.status(404).json({
            message: 'Could not find the booking with the given id.',
        })
    }

    res.json({
        message: 'Deleted booking.',
    })
}

exports.fetchBookings = fetchBookings
exports.fetchBookingById = fetchBookingById
exports.fetchBookingsByStatus = fetchBookingsByStatus
exports.addBooking = addBooking
exports.deleteBooking = deleteBooking
exports.editBooking = editBooking
