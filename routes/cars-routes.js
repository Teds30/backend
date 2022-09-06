const express = require('express')
const { check } = require('express-validator')
const checkAuth = require('../middlewares/check-auth')
const checkRole = require('../middlewares/check-role')

const router = express.Router()

const carsControllers = require('../controllers/cars-controllers')

router.get('/', carsControllers.fetchCars)

router.get('/type/:type', carsControllers.fetchCarsByType)

router.get('/:id', carsControllers.fetchCarById)

// router.use(checkAuth) // PROTECTOR; CHECKS IF THE SENDER IS THE CREATOR
router.use(checkRole) // PROTECTOR; CHECKS IF THE SENDER IS THE CREATOR
router.post(
    '/',
    [
        check('brand').not().isEmpty(),
        check('model').not().isEmpty(),
        check('type').not().isEmpty(),
        // check('seats').isInt({gt: 0}),
        // check('transmission').not().isEmpty()
    ],
    carsControllers.addCar
)

router.delete('/:id', carsControllers.deleteCar)

router.patch('/:id', carsControllers.editCar)

module.exports = router
