const Car = require('../models/cars-schema.js')

const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error.js')

const fetchCars = async (req, res, next) => {
    let cars
    try {
        cars = await Car.find({}).sort({ brand: 'asc' })
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a car.',
            500
        )
        return next(error)
    }

    if (!cars) {
        const error = new HttpError(
            'Could not find cars for the provided id.',
            404
        )
        return next(error)
    }

    res.json(cars)
}

const fetchCarById = async (req, res, next) => {
    const { id } = req.params

    let car
    try {
        car = await Car.findById(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a car.',
            500
        )
        return next(error)
    }

    if (!car) {
        const error = new HttpError(
            'Could not find car for the provided id.',
            404
        )
        return next(error)
    }

    res.json({
        car,
    })
}

const addCar = async (req, res, next) => {
    const errors = validationResult(req)

    // console.log(errors)

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const {
        image,
        brand,
        model,
        type,
        seats,
        transmission,
        dailyRate,
        isAvailable = true,
    } = req.body

    const newCar = new Car({
        image,
        brand,
        model,
        type,
        seats,
        transmission,
        isAvailable,
        dailyRate,
    })

    try {
        const response = await newCar.save()
    } catch (err) {
        const error = new HttpError('Adding car failed, please try again.', 500)
        return next(error)
    }

    res.status(201).json({
        message: 'Added new car',
        car: newCar,
    })
}

const editCar = async (req, res, next) => {
    const { id } = req.params
    const {
        image,
        brand,
        model,
        type,
        seats,
        transmission,
        dailyRate,
        pickup_location,
    } = req.body

    let car

    try {
        car = await Car.findById(id)

        if (image) car.image = image
        if (brand) car.brand = brand
        if (model) car.model = model
        if (type) car.type = type
        if (seats) car.seats = seats
        if (transmission) car.transmission = transmission
        if (dailyRate) car.dailyRate = dailyRate
        if (pickup_location) car.pickup_location = pickup_location

        await car.save()
    } catch (err) {
        const error = new HttpError(
            'Modifying car failed, please try again.',
            500
        )
        console.log(err.message)
        return next(error)
    }

    // const fullInfo = await car.populate('pickup_location')
    // console.log(fullInfo)

    res.json({
        message: 'Car updated successfully.',
        car: car,
    })
}

const deleteCar = async (req, res, next) => {
    const { id } = req.params

    let cars
    try {
        cars = await Car.findByIdAndDelete(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete car.',
            500
        )
    }

    if (!cars) {
        res.status(404).json({
            message: 'Could not find the car with the given id.',
        })
    }

    res.json({
        message: 'Deleted car.',
    })
}

const fetchCarsByType = async (req, res, next) => {
    const { type } = req.params

    let cars
    try {
        cars = await Car.find({ type: type })
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find cars with that type.',
            500
        )
        return next(error)
    }

    if (!cars) {
        const error = new HttpError(
            'Could not find car for the provided id.',
            404
        )
        return next(error)
    }

    res.json(cars)
}

exports.fetchCars = fetchCars
exports.fetchCarById = fetchCarById
exports.addCar = addCar
exports.deleteCar = deleteCar
exports.editCar = editCar
exports.fetchCarsByType = fetchCarsByType
