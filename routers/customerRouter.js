const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const customerController = require('../controllers/customerController')
const isCustomer = require('../middlewares/isCustomer')
const { validatorBody } = require('../validators')
const customerSchemas = require('../validators/customer')


router.route('/info')
    .get(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        customerController.customerInfo
    )
    .put(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorBody(customerSchemas.updateInfo),
        customerController.updateCustomerInfo
    )

module.exports = router