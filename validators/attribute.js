const Joi = require('@hapi/joi')

const attributeSchemas = {
    createAttribute: Joi.object().keys({
        attributeName: Joi.string().required().messages({
            'string.empty': 'AttributeName is required',
            'string.required': 'AttributeName is required',
        }),
        attributeDescription: Joi.string().required().messages({
            'string.empty': 'AttributeDescription is required',
            'string.required': 'AttributeDescription is required',
        }),
    }),
}

// Export module
module.exports = attributeSchemas