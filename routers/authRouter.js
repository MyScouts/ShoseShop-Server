const router = require('express-promise-router')()
const authController = require('../controllers/authController')
const { validatorBody } = require('../validators')
const authSchemas = require('../validators/auth')
// 
router.route('/manager/register')
    .post(validatorBody(authSchemas.createAccount), authController.managerCreate)
router.route('/manager/login')
    .post(validatorBody(authSchemas.createAccount), authController.managerLogin)

router.route('/register')
    .post(validatorBody(authSchemas.createCustomer), authController.registerCustomer)
router.route('/login')
    .post(validatorBody(authSchemas.createAccount), authController.customerLogin)

// Export module
module.exports = router