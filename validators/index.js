const Joi = require('@hapi/joi')

const validatorBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        console.log(validatorResult)
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

const validatiorParams = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ params: req.params[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const validatorQuery = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ query: req.query[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['query']) req.value.query = {}

            req.value.query[name] = req.query[name]
            next()
        }
    }
}
const baseSchema = {
    idSchema: Joi.object().keys({
        params: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    page: Joi.object().keys({
        query: Joi.number().integer().required().messages({
            'number.base': 'page must be an integer',
            'number.integer': 'page must be an integer',
            'number.required': 'page is required',
        }),
    }),

    pageSize: Joi.object().keys({
        query: Joi.number().integer().required().messages({
            'number.base': 'pageSize must be an integer',
            'number.integer': 'pageSize must be an integer',
            'number.required': 'pageSize is required',
        }),
    }),

    search: Joi.object().keys({
        query: Joi.string().allow('').allow(null).messages({
            'string.required': 'search is required',
        }),
    })

}


module.exports = {
    validatiorParams,
    validatorQuery,
    validatorBody,
    baseSchema
}