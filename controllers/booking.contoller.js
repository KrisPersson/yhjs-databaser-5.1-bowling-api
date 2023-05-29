const { createBooking, findBookingByBookingNum, deleteBooking } = require('../models/booking.model')

async function createBookingCtrl(request, response) {
    try {
        const { customerEmail, startDate, startTime, shoeSizes, requestedAmtOfLanes } = request.body
        const input = { customerEmail, startDate, startTime, players: shoeSizes, requestedAmtOfLanes }

        const booking = await createBooking(input)
        const { bookingNumber, players, lanes, totalPrice, createdAt } = booking
        const parsedStartTime = startTime < 10 ? `0${startTime}.00` : `${startTime}.00`

        response.json({ 
            success: true, 
            message: 'Booking created successfully', 
            booking: {
                customerEmail,
                startDate,
                startTime: parsedStartTime,
                numberOfPlayers: players.length,
                shoeSizes: players.map(player => player.shoeSize),
                numberOfLanes: lanes.length,
                laneIDs: lanes,
                totalPrice,
                bookingNumber,
                createdAt
            }  
        })

    } catch (error) {
        response.json({ success: false, message: error.message })
    }
}

async function findBookingCtrl(request, response) {
    try {
        const bookingNumber = request.headers.bookingnumber
        const booking = await findBookingByBookingNum(bookingNumber)
        if (!booking) {
            response.status(404).json({ 
                success: false, 
                message: 'Booking number returned no matches' 
            }) 
        } else {
            const { 
                customerEmail, 
                startDate, 
                startTime, 
                players, 
                lanes, 
                totalPrice, 
                createdAt
            } = booking

            const parsedStartTime = startTime < 10 ? `0${startTime}.00` : `${startTime}.00`

            response.json({
                success: true, 
                booking: {
                    customerEmail,
                    startDate,
                    startTime: parsedStartTime,
                    numberOfPlayers: players.length,
                    shoeSizes: players.map(player => player.shoeSize),
                    numberOfLanes: lanes.length,
                    laneIDs: lanes,
                    totalPrice,
                    bookingNumber,
                    createdAt,
                    modifiedAt: booking.modifiedAt ? 
                        booking.modifiedAt : 
                        'Never modified'
                } 
            })
        }
    } catch (error) {
        response.status(400).json({ success: false, message: error.message })
    }
}

async function deleteBookingCtrl(request, response) {
    try {
        await deleteBooking(request.headers.bookingnumber)
        response.json({ success: true, message: `Booking successfully deleted` })
    } catch (error) {
        response.status(400).json({ success: false, message: error.message })
    }
}

async function editBookingCtrl() {

}


module.exports = { findBookingCtrl, createBookingCtrl, deleteBookingCtrl, editBookingCtrl }
