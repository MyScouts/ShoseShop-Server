const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const feedbackController = require('../controllers/feedbackController')
const isCustomer = require('../middlewares/isCustomer')
const { validatorBody } = require('../validators')
const feedbackSchemas = require('../validators/feedback')


router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorBody(feedbackSchemas.createFeedback),
        feedbackController.newFeedBack
    )

// Export module
module.exports = router