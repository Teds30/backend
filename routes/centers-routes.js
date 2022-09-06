const express = require('express')
const {check} = require('express-validator')
const checkRole = require('../middlewares/check-role')

const router = express.Router()

const centersControllers = require('../controllers/centers-controllers')

router.get('/', centersControllers.fetchCenters)

router.use(checkRole) // PROTECTOR; CHECKS IF THE SENDER IS AN ADMIN

router.post('/', 
[
    check('name').not().isEmpty(),
    check('address').not().isEmpty(),
    check('location').not().isEmpty(),
]
,centersControllers.addCenter)

router.delete('/:id', centersControllers.deleteCenter)

router.patch('/:id', centersControllers.editCenter)

module.exports = router
