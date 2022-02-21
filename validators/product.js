const Joi = require('@hapi/joi')

const productSchemas = {
    createProduct: Joi.object().keys({
        productName: Joi.string().required().messages({
            'string.empty': 'productName is required',
            'string.required': 'productName is required',
        }),
        price: Joi.number().required().messages({
            'number.empty': 'price is required',
            'number.required': 'price is required',
        }),
        sizes: Joi.array().items(Joi.number().integer()).required().messages({
            'array.base': 'sizes must be an array',
            'array.required': 'sizes is required',
        }),
        categoryId: Joi.number().integer().required().messages({
            'number.base': 'categoryId must be an integer',
            'number.integer': 'categoryId must be an integer',
            'number.required': 'categoryId is required',
        }),
        storageQuantity: Joi.number().integer().required().messages({
            'number.base': 'storageQuantity must be an integer',
            'number.integer': 'storageQuantity must be an integer',
            'number.required': 'storageQuantity is required',
        }),
    }),
}

module.exports = productSchemas