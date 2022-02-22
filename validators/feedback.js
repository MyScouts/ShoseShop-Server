const Joi = require('@hapi/joi')

const feedbackSchemas = {
    createFeedback: Joi.object().keys({
        feedbackName: Joi.string().required().messages({
            'string.empty': 'feedbackName is required',
            'string.required': 'feedbackName is required',
        }),
        feedbackDescription: Joi.string().required().messages({
            'string.empty': 'feedbackDescription is required',
            'string.required': 'feedbackDescription is required',
        }),
        grade: Joi.number().required().messages({
            'number.empty': 'Grade is required',
            'number.required': 'Grade is required',
        }),
    }),
}

// Export module
module.exports = feedbackSchemas