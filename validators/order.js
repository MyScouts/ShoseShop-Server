const Joi = require('@hapi/joi')

const orderSchemas = {
    createOrder: Joi.object().keys({
        customerName: Joi.string().required(),
        customerPhone: Joi.string().required().pattern(/^\+?\d{10}$/).messages({
            'string.pattern.base': 'Phone number must be in the format 9999999999'
        }),
        shipToAddress: Joi.string().required().messages({
            'string.empty': 'Ship to address is required'
        }),
        items: Joi.array().items(Joi.object().keys({
            productId: Joi.number().integer().required().messages({
                'number.integer': 'Product id must be an integer'
            }),
            quantity: Joi.number().integer().required().messages({
                'number.integer': 'Quantity must be an integer'
            }),
        })).required().messages({
            'array.items.required': 'Items are required'
        }),
    }),

    updateOrderStatus: Joi.object().keys({
        status: Joi.number().integer().valid(0, 1, 2, 3).required().messages({
            'number.integer': 'Status must be an integer',
            'number.valid': 'Status must be 0, 1, 2 or 3'
        }),
    }),
}

module.exports = orderSchemas