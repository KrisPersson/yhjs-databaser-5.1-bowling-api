require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const { bookingRouter } = require('./routes/booking.route')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const database = mongoose.connection
database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Database connection established'))


app.use(express.json())

app.use('/api/booking', bookingRouter)

app.listen(PORT, () => {
    console.log('Starting server')
})
