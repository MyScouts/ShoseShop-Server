const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const orderController = require('../controllers/orderController')
const isCustomer = require('../middlewares/isCustomer')
const { validatorBody, validatorQuery, baseSchema } = require('../validators')
const orderSchemas = require('../validators/order')


router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorBody(orderSchemas.createOrder),
        orderController.newOrder
    )

router.route('/my-orders')
    .get(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        orderController.getMyOrders
    )

router.route('/my-orders/:orderId')
    .get(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        orderController.getMyOrderDetail
    )
// Export module
module.exports = router