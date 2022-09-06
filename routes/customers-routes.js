const express = require('express')
const { check } = require('express-validator')
const checkRole = require('../middlewares/check-role')

const router = express.Router()

const customersControllers = require('../controllers/customers-controllers')

router.use(checkRole) // PROTECTOR; CHECKS IF THE SENDER IS AN ADMIN
router.get('/', customersControllers.fetchCustomers)

module.exports = router
