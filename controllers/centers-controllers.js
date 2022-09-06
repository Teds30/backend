const Center = require('../models/center-schema.js')

const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error.js')

const fetchCenters = async (req, res, next) => {
    let centers
    try {
        centers = await Center.find({})
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a center.',
            500
        )
        return next(error)
    }

    if (!centers) {
        const error = new HttpError(
            'Could not find centers for the provided id.',
            404
        )
        return next(error)
    }

    res.json(centers)
}

const fetchCenterById = async (req, res, next) => {
    const { id } = req.params

    let center
    try {
        center = await Center.findById(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a center.',
            500
        )
        return next(error)
    }

    if (!center) {
        const error = new HttpError(
            'Could not find center for the provided id.',
            404
        )
        return next(error)
    }

    res.json({
        center,
    })
}

const addCenter = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const { name, address, location } = req.body

    const newCenter = new Center({
        name,
        address,
        location,
    })

    try {
        const response = await newCenter.save()
    } catch (err) {
        const error = new HttpError(
            'Adding center failed, please try again.',
            500
        )
        return next(error)
    }

    res.status(201).json({
        message: 'Added new center',
        center: newCenter,
    })
}

const editCenter = async (req, res, next) => {
    const { id } = req.params
    const { name, address, location } = req.body

    try {
        const center = await Center.findById(id)

        if (name) center.name = name
        if (address) center.address = address
        if (location) center.location = location

        await center.save()

        res.status(204).json({
            message: 'Center updated successfully.',
            center: center,
        })
    } catch (err) {
        const error = new HttpError(
            'Modifying center failed, please try again.',
            500
        )
        return next(error)
    }
}

const deleteCenter = async (req, res, next) => {
    const { id } = req.params

    let center
    try {
        center = await Center.findByIdAndDelete(id)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete center.',
            500
        )
    }

    if (!center) {
        res.status(404).json({
            message: 'Could not find the center with the given id.',
        })
    }

    res.status(204).json({
        message: 'Deleted center.',
    })
}

exports.fetchCenters = fetchCenters
exports.fetchCenterById = fetchCenterById
exports.addCenter = addCenter
exports.deleteCenter = deleteCenter
exports.editCenter = editCenter
