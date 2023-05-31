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
        startDate: new Date(startDate),
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

async function editBooking(input) {
    const { bookingNumber, amtPlayers, shoeSizes, requestedAmtOfLanes } = input
    const bookingInDb = await findBookingByBookingNum(bookingNumber)

    if (!bookingInDb) {
        throw new Error('Booking with provided ID not found')
    }

    let newTotalPrice = 0
    let updateObject = {}

    if (amtPlayers                              // Updating amount of players, if changed.
        && amtPlayers !== bookingInDb.numberOfPlayers
        && amtPlayers === shoeSizes.length ) {

            updateObject.players = shoeSizes.map(player => {
                return { shoeSize: player }
            })
            newTotalPrice += shoeSizes.length * 120
    } else { 
        newTotalPrice += bookingInDb.players.length * 120 
    }

    if (requestedAmtOfLanes                     // Updating amount of lanes, if changed.
        && requestedAmtOfLanes !== bookingInDb.numberOfLanes) {
            const bookings = await Booking.find({ 
                startDate: bookingInDb.startDate, 
                startTime: bookingInDb.startTime 
            })

            let unavailableLanes = []

            bookings.forEach(booking => {
                unavailableLanes = unavailableLanes.concat(booking.lanes)
            })

            const newProposedAmtOfLanes = 
            (unavailableLanes.length - bookingInDb.lanes.length) + requestedAmtOfLanes

            if (newProposedAmtOfLanes <= 8) {

                const newUnavailableLanes = unavailableLanes.filter(
                    lane => !bookingInDb.lanes.includes(lane)
                )

                const assignedLanes = []

                for (let i = 1; i <= 8; i++ ) {
                    if (!newUnavailableLanes.includes(i) 
                        && assignedLanes.length < requestedAmtOfLanes
                    ){
                        assignedLanes.push(i)
                    }
                }
                updateObject.lanes = [...assignedLanes]
                newTotalPrice += assignedLanes.length * 100
            } else { 
                throw new Error('Not enough lanes available for this time slot') 
            }
            
        } else { 
            newTotalPrice += (bookingInDb.lanes.length * 100) 
        }

        if (newTotalPrice !== bookingInDb.totalPrice) {
            updateObject.totalPrice = newTotalPrice
        }

        return await Booking.findOneAndUpdate({ bookingNumber }, { $set: {...updateObject, modifiedAt: new Date().toLocaleString() }})
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

async function getBookingSchedule(input) {
    const { startDate, endDate } = input
    let start = new Date(startDate)
    let end = new Date(endDate)

    const bookings = await Booking.where("startDate")
        .gte(start)
        .lte(end)

    return bookings
}

module.exports = { createBooking, findBookingByBookingNum, deleteBooking, editBooking, getBookingSchedule }
