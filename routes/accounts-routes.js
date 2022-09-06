const express = require('express')
const { check } = require('express-validator')
const checkRole = require('../middlewares/check-role')

const router = express.Router()

const accountsController = require('../controllers/accounts-controllers')

router.post(
    '/signup',
    [
        check('username').isLength({ min: 1 }).withMessage('Enter a username.'),
        check('password')
            .isLength({ min: 8 })
            .withMessage(
                'Password length must be atleast 8 or more characters'
            ),
    ],
    accountsController.signup
)
router.post(
    '/login',
    [
        check('username').isLength({ min: 1 }).withMessage('Enter a username.'),
        check('password')
            .isLength({ min: 1 })
            .withMessage(
                'Enter a password.'
            ),
    ],
    accountsController.login
)

router.use(checkRole) // PROTECTOR; CHECKS IF THE SENDER IS AN ADMIN
router.get('/', accountsController.getAccounts)

module.exports = router
