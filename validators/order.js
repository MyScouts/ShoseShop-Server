const Joi = require('@hapi/joi')

const orderSchema = {
    createOrder: Joi.object().keys({
        customerName: Joi.string().required(),
        customerPhone: Joi.string().required(),
        items: Joi.array().items(Joi.object().keys({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().required(),
        })).required(),
    }),

}

module.exports = orderSchema