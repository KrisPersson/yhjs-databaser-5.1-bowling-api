const { createBooking, findBookingByBookingNum, deleteBooking, editBooking, getBookingSchedule } = require('../models/booking.model')
const { parseBookingSchedule } = require('../utils')

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
                startDate: booking.startDate.toLocaleDateString(),
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

async function getBookingScheduleCtrl(request, response) {
    const { start_date, end_date } = request.headers
    const input = { startDate: start_date, endDate: end_date }
    try {
        const bookings = await getBookingSchedule(input)
        const parsedBookingSchedule = parseBookingSchedule(bookings)
        response.json({ success: true, bookingSchedule: parsedBookingSchedule })
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
                    startDate: startDate.toLocaleDateString(),
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

async function editBookingCtrl(request, response) {
    const { bookingNumber, amtPlayers, shoeSizes, requestedAmtOfLanes } = request.body
    const input = {
        bookingNumber,
        amtPlayers: amtPlayers ? amtPlayers : null,
        shoeSizes,
        requestedAmtOfLanes
    }
    try {
        await editBooking(input)
        const updatedBooking = await findBookingByBookingNum(bookingNumber)
        const { 
            customerEmail, 
            startDate, 
            startTime, 
            players, 
            lanes, 
            totalPrice, 
            createdAt
        } = updatedBooking

        const parsedStartTime = startTime < 10 ? `0${startTime}.00` : `${startTime}.00`

        response.json({
            success: true, 
            booking: {
                customerEmail,
                startDate: startDate.toLocaleDateString(),
                startTime: parsedStartTime,
                numberOfPlayers: players.length,
                shoeSizes: players.map(player => player.shoeSize),
                numberOfLanes: lanes.length,
                laneIDs: lanes,
                totalPrice,
                bookingNumber,
                createdAt,
                modifiedAt: updatedBooking.modifiedAt ? 
                    updatedBooking.modifiedAt : 
                    'Never modified'
            } 
        })
    } catch (error) {
        response.status(400).json({ success: false, message: error.message })
    }
}


module.exports = { findBookingCtrl, createBookingCtrl, deleteBookingCtrl, editBookingCtrl, getBookingScheduleCtrl }
