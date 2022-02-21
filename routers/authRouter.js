const router = require('express-promise-router')()
const authController = require('../controllers/authController')
router.route('/admin/register')
    .post(authController.managerCreate)


// Export module
module.exports = router

