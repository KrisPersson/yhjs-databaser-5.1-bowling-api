
function parseBookingSchedule(bookings) {

    let result = {
        "lane1": [],
        "lane2": [],
        "lane3": [],
        "lane4": [],
        "lane5": [],
        "lane6": [],
        "lane7": [],
        "lane8": []
    }
    const parsedDateBookings = bookings.map(booking => {
        const dateAndTime = booking.startDate
        dateAndTime.setHours(Number(booking.startTime) + 2)
        return {...booking, startDate: dateAndTime}
    })

    const sortedBookings = sortLaneSchedule(parsedDateBookings)
    
    sortedBookings.forEach(booking => {
        const { startTime, startDate } = booking._doc

        const parsedStartTime = startTime < 10 ? `0${startTime}.00` : `${startTime}.00`

        const bookingItem = {
            startDate: startDate.toLocaleDateString(),
            startTime: parsedStartTime
        }
        for (const lane of booking._doc.lanes) {
            const name = "lane" + lane
            result[name].push(bookingItem)
        }
    })

    return result
}

function sortLaneSchedule(arr) {
    let sortedArr = [...arr]
    sortedArr.sort((a, b) => {
        if (a.startDate > b.startDate) {
            return 1
        } else if (b.startDate > a.startDate) {
            return -1
        } else {
            return 0
        }
    })

    return sortedArr
}

module.exports = { parseBookingSchedule }
