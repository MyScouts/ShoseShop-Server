const Joi = require('@hapi/joi')


const customerSchemas = {
    updateInfo: Joi.object().keys({
        fullName: Joi.string().required().messages({
            'string.empty': 'FullName is required',
            'string.required': 'FullName is required',
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.required': 'Email is required',
        }),
        phoneNumber: Joi.string().required().regex(/[{0,1}[0-9]{9}]*$/).messages({
            'string.empty': 'PhoneNumber is required',
            'string.required': 'PhoneNumber is required',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Address is required',
            'string.required': 'Address is required',
        }),
        sex: Joi.number().required().valid(0, 1, 2)
    }),
}

// Export module
module.exports = customerSchemas