const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const feedbackController = require('../controllers/feedbackController')
const isCustomer = require('../middlewares/isCustomer')
const { validatorBody, validatorQuery, baseSchema } = require('../validators')
const feedbackSchemas = require('../validators/feedback')
const isManager = require('../middlewares/isManager')


router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorBody(feedbackSchemas.createFeedback),
        feedbackController.newFeedBack
    )

router.route('/get-all')
    .get(
        passport.authenticate('jwt', { session: false }),
        isManager,
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        feedbackController.getAllFeedbacks
    )

// Export module
module.exports = router