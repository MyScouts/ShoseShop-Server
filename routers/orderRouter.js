const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const orderController = require('../controllers/orderController')
const isCustomer = require('../middlewares/isCustomer')
const { validatorBody, validatorQuery, baseSchema } = require('../validators')
const orderSchemas = require('../validators/order')
const isManager = require('../middlewares/isManager')


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

router.route('/get-all')
    .get(
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        passport.authenticate('jwt', { session: false }),
        orderController.getAllOrders
    )

router.route('/:orderId')
    .get(
        passport.authenticate('jwt', { session: false }),
        isManager,
        orderController.getOrderDetail
    )

router.route('/:orderId/update-status')
    .put(
        passport.authenticate('jwt', { session: false }),
        isManager,
        validatorBody(orderSchemas.updateOrderStatus),
        orderController.updateOrderStatus
    )
// Export module
module.exports = router