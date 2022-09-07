const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Request denied!')
        }
        const decodeToken = jwt.verify(token, 'supersecret_dont_share')

        if (decodeToken.userRole === 'admin') {
            req.userData = {
                userId: decodeToken.userId,
                userRole: decodeToken.userRole,
            }
            next()
        } else {
            throw new Error('You have no permission to perform this action.')
        }
    } catch (err) {
        // const error = new HttpError('Request denied!', 401)
        return next(err)
    }
}
