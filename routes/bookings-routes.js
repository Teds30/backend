const express = require('express')
const { check } = require('express-validator')
const HttpError = require('../models/http-error.js')

const checkRole = require('../middlewares/check-role')

const router = express.Router()

const bookingsControllers = require('../controllers/bookings-controllers')


router.get('/', bookingsControllers.fetchBookings)

router.get('/status/:status', bookingsControllers.fetchBookingsByStatus)

router.get('/:id', bookingsControllers.fetchBookingById)

router.use(checkRole) // PROTECTOR; CHECKS IF THE SENDER IS AN ADMIN
router.post(
    '/',
    [
        check('booking_dates').not().isEmpty(),
        // check('seats').isInt({gt: 0}),
        // check('transmission').not().isEmpty()
    ],
    bookingsControllers.addBooking
)

router.delete('/:id', bookingsControllers.deleteBooking)

router.patch('/:id', bookingsControllers.editBooking)

module.exports = router
