const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authorization failed!')
        }
        const decodeToken = jwt.verify(token, process.env.JWT_KEY)
        req.userData = {
            userId: decodeToken.userId,
            userRole: decodeToken.userRole,
        }
        next()
    } catch (err) {
        const error = new HttpError('Authorization failed!', 401)
        return next(error)
    }
}
