const Joi = require('@hapi/joi')

const favoriteSchemas = {
    createFavorite: Joi.object().keys({
        productId: Joi.number().integer().required().messages({
            'number.empty': 'productId is required',
            'number.required': 'productId is required',
        }),
    }),
}

// Export module
module.exports = favoriteSchemas