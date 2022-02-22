const router = require('express-promise-router')()
const customerController = require('../controllers/customerController')
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const isCustomer = require('../middlewares/isCustomer')


router.route('/info')
    .get(passport.authenticate('jwt', { session: false }), isCustomer, customerController.customerInfo)

module.exports = router