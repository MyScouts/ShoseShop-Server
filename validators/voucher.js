const Joi = require('@hapi/joi')

const voucherSchemas = {
    createVoucher: Joi.object().keys({
        productId: Joi.number().integer().required().messages({
            'number.integer': 'Product id must be an integer'
        }),
        startDate: Joi.date().required().messages({
            'date.base': 'Start date must be a date'
        }),
        endDate: Joi.date().required().min(Joi.ref("startDate")).messages({
            'date.base': 'End date must be a date'
        }),
        status: Joi.string().allow('').allow(null).default(''),
        voucherCode: Joi.string().required().messages({
            'string.empty': 'Voucher code is required'
        }),
        type: Joi.string().allow('').allow(null).default(''),
        discount_percentage: Joi.number().integer().allow('').allow(null).default(''),
        quantity: Joi.number().integer().allow('').allow(null).default(''),
    }),

}

module.exports = voucherSchemas
