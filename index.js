const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')

const carsRoute = require('./routes/cars-routes')
const centersRoute = require('./routes/centers-routes')
const bookingsRoute = require('./routes/bookings-routes')
const customersRoute = require('./routes/customers-routes')
const accountsRoutes = require('./routes/accounts-routes')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use('/api/cars', carsRoute)
app.use('/api/centers', centersRoute)
app.use('/api/bookings', bookingsRoute)
app.use('/api/customers', customersRoute)
app.use('/api/accounts', accountsRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    throw error
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' })
})

app.listen(4000)

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mycluster.wwwhb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(process.env.PORT || 5000)
    })
    .catch((err) => {
        console.log(err)
    })
