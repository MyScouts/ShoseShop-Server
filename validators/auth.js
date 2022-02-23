const Joi = require('@hapi/joi')


const authSchemas = {
    createAccount: Joi.object().keys({
        userName: Joi.string().required().messages({
            'string.empty': 'UserName is required',
            'string.required': 'UserName is required',
        }),
        password: Joi.string().min(8).required().messages({
            'string.empty': 'Password is required',
            'string.required': 'Password is required',
        }),
    }),

    createCustomer: Joi.object().keys({
        userName: Joi.string().required().messages({
            'string.empty': 'UserName is required',
            'string.required': 'UserName is required',
        }),
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
        password: Joi.string().min(8).required().messages({
            'string.empty': 'Password is required',
            'string.required': 'Password is required',
        }),
        passwordConfirm: Joi.string().min(8).valid(Joi.ref('password')).required().messages({
            'string.empty': 'PasswordConfirm is required',
            'string.required': 'PasswordConfirm is required',
        }),
        sex: Joi.number().required().valid(0, 1, 2)
    }),

    updatePassword: Joi.object().keys({
        password: Joi.string().min(8).required().messages({
            'string.empty': 'Password is required',
            'string.required': 'Password is required',
        }),
        newPassword: Joi.string().min(8).required().messages({
            'string.empty': 'Password is required',
            'string.required': 'Password is required',
        }),
        passwordConfirm: Joi.string().min(8).valid(Joi.ref('newPassword')).required().messages({
            'string.empty': 'PasswordConfirm is required',
            'string.required': 'PasswordConfirm is required',
        }),
    })
}

// Export module
module.exports = authSchemas