const { Router } = require('express')
const router = Router()
const { createBookingCtrl, findBookingCtrl, deleteBookingCtrl, editBookingCtrl } = require('../controllers/booking.contoller')
const { checkCreateBooking, checkHeaderBookingId } = require('../middlewares/booking.middleware')

router.post('/', checkCreateBooking, createBookingCtrl)
router.get('/', checkHeaderBookingId, findBookingCtrl)
router.put('/', editBookingCtrl)
router.delete('/', checkHeaderBookingId, deleteBookingCtrl)


module.exports = { bookingRouter: router }

