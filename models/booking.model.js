const Booking = require('./booking.schema')

async function findBookingByBookingNum(bookingNumber) {
    return await Booking.findOne({ bookingNumber })
}

async function createBooking(input) {
    const { customerEmail, startDate, startTime, players, requestedAmtOfLanes } = input

    const lanes = await assignLanes(startDate, startTime, requestedAmtOfLanes)
    const totalPrice = (players.length * 120) + (requestedAmtOfLanes * 100)

    const booking = await Booking.create({
        customerEmail,
        startDate,
        startTime,
        players: players.map(playerShoeSize => { 
            return { shoeSize: playerShoeSize }
        }),
        lanes,
        totalPrice
    })

    return booking
}

async function getBookingsByStartTime(startDate, startTime) {
    return await Booking.find({ startDate, startTime })
}

async function deleteBooking(bookingNumber) {
    const deletedBooking = await Booking.deleteOne({ bookingNumber }) 
    if (deletedBooking.deletedCount !== 1) {
        throw new Error('Failed to delete booking')
    }
}

async function assignLanes(startDate, startTime, requestedAmtOfLanes) {
    const bookings = await Booking.find({ startDate, startTime })
    
    let unavailableLanes = []
    bookings.forEach(booking => {
        unavailableLanes = unavailableLanes.concat(booking.lanes)
    })
    if (unavailableLanes.length + requestedAmtOfLanes > 8) {
        throw new Error('Not enough lanes available for this time slot')
    }
    let assignedLanes = []
    for (let i = 1; i <= 8; i++ ) {
        if (!unavailableLanes.includes(i) 
            && assignedLanes.length < requestedAmtOfLanes
        ){
            assignedLanes.push(i)
        }
    }
    return assignedLanes
}

module.exports = { createBooking, findBookingByBookingNum, deleteBooking }
