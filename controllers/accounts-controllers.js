const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const Account = require('../models/account-schema')

const getAccounts = async (req, res, next) => {
    let accounts
    try {
        accounts = await Account.find({})
    } catch (err) {
        const error = new HttpError(
            'Fetching accounts failed, please try again later.',
            500
        )
        return next(error)
    }
    res.json({
        accounts: accounts.map((account) =>
            account.toObject({ getters: true })
        ),
    })
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }
    const { username, password } = req.body

    let existingUser

    try {
        existingUser = await Account.findOne({ username: username })
    } catch (err) {
        const error = new HttpError('Failed to create new account.', 500)
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError('Username has already been taken.', 422)
        return next(error)
    }

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError(
            'Could not create account, please try again.',
            500
        )
        return next(error)
    }

    const createdAccount = new Account({
        username: username,
        password: hashedPassword,
    })

    try {
        await createdAccount.save()
    } catch (err) {
        const error = new HttpError(
            'Could not create account, please try again.',
            500
        )
        return next(error)
    }

    let token

    try {
        token = jwt.sign(
            { userId: createdAccount.id, username: createdAccount.username },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        )
        return next(error)
    }

    res.status(201).json({
        user: createdAccount.id,
        username: createdAccount.username,
        token: token,
    }) // createdUser includes the PW
}

const login = async (req, res, next) => {
    const { username, password } = req.body

    let existingUser

    try {
        existingUser = await Account.findOne({ username: username })
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        )
        return next(error)
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        )
        return next(error)
    }

    let isValidPassword = false

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        )
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        )
        return next(error)
    }

    let token

    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                username: existingUser.username,
                userRole: existingUser.role,
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        )
        return next(error)
    }

    res.json({
        userId: existingUser.id,
        userRole: existingUser.userRole,
        username: existingUser.username,
        token: token,
    })
}

exports.getAccounts = getAccounts
exports.signup = signup
exports.login = login
