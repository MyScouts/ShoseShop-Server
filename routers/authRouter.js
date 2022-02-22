const router = require('express-promise-router')()
const authController = require('../controllers/authController')
const { validatorBody } = require('../validators')
const authSchemas = require('../validators/auth')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')
// 
router.route('/manager/register')
    .post(
        validatorBody(authSchemas.createAccount),
        authController.managerCreate
    )
router.route('/manager/login')
    .post(
        validatorBody(authSchemas.createAccount),
        authController.managerLogin
    )

router.route('/register')
    .post(
        validatorBody(authSchemas.createCustomer),
        authController.registerCustomer
    )
router.route('/login')
    .post(
        validatorBody(authSchemas.createAccount),
        authController.customerLogin
    )

router.route('/update-password')
    .put(
        passport.authenticate('jwt', { session: false }),
        validatorBody(authSchemas.updatePassword),
        authController.updatePassword
    )

// Export module
module.exports = router