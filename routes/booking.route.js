const { Router } = require('express')
const router = Router()
const { createBookingCtrl, findBookingCtrl, deleteBookingCtrl, editBookingCtrl, getBookingScheduleCtrl } = require('../controllers/booking.contoller')
const { checkCreateBooking, checkHeaderBookingId, checkGetBookingSchedule } = require('../middlewares/booking.middleware')

router.post('/', checkCreateBooking, createBookingCtrl)
router.get('/', checkHeaderBookingId, findBookingCtrl)
router.put('/', editBookingCtrl)
router.delete('/', checkHeaderBookingId, deleteBookingCtrl)

router.get('/schedule', checkGetBookingSchedule, getBookingScheduleCtrl)



module.exports = { bookingRouter: router }

