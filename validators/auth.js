const Joi = require('@hapi/joi')


const authSchemas = {
    createAccount: Joi.object().keys({
        userName: Joi.string().required().messages({
            'string.empty': 'UserName is required',
            'string.required': 'UserName is required',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'string.required': 'Password is required',
        }),
    }),
}

// Export module
module.exports = authSchemas