const router = require('express-promise-router')()
const categoryController = require('../controllers/categoryController')


router.route('/')
    .post(categoryController.newCategory)

router.route('/get-all')
    .get(categoryController.getAllIds)


module.exports = router