const Joi = require('joi');

const createBookingSchema = Joi.object({
    customerEmail: Joi.string()
        .email({ 
            minDomainSegments: 2, 
            tlds: { 
                allow: ['com', 'net', 'se'] 
            } 
        })
        .required(),
    startDate: Joi.date().min('now').required(),
    startTime: Joi.number().min(0).max(23).required(),
    amtPlayers: Joi.number().required(),
    shoeSizes: Joi.array().items(
            Joi.number().min(25).max(50)
        )
        .required(),
    requestedAmtOfLanes: Joi.number().min(1).max(8).required()
})

const bookingByIdSchema = Joi.string().required()

async function checkHeaderBookingId(request, response, next) {
    const { bookingnumber } = request.headers
    const validation = bookingByIdSchema.validate(bookingnumber)
    if (validation.error) {
        response.status(400).json({ success: false, message: validation.error.message })
    } else {
        next()
    }
}

async function checkCreateBooking(request, response, next) {
    if (request.body.amtPlayers !== request.body.shoeSizes.length) {
        response.status(400).json({ 
            success: false, 
            message: 'Amount of players does not equal the amount of provided shoe sizes' 
        })
        return
    }
    const validation = createBookingSchema.validate(request.body)
    if (validation.error) {
        response.status(400).json({ success: false, message: validation.error.message })
    } else {
        next()
    }
}

module.exports = { checkCreateBooking, checkHeaderBookingId }
