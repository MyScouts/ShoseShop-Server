const router = require('express-promise-router')()
const { validatorQuery, baseSchema, validatorBody } = require('../validators')
const productController = require('../controllers/productController')
const multer = require('multer')
const { storage, imageFilter } = require('../utils/fileUpload')
const productSchemas = require('../validators/product')
// Router body
router.route('/get-all')
    .get(validatorQuery(baseSchema.page, "page"), validatorQuery(baseSchema.pageSize, "pageSize"), validatorQuery(baseSchema.search, "search"), productController.getAllProducts)

router.route('/')
    .post(multer({ storage: storage, fileFilter: imageFilter }).single('productImage'), validatorBody(productSchemas.createProduct), productController.createProduct)

router.route('/:productId')
    .get(productController.getDetailProduct)
    .put(multer({ storage: storage, fileFilter: imageFilter }).single('productImage'), validatorBody(productSchemas.createProduct), productController.updateProduct)
    .delete(productController.deleteProduct)
// Export module
module.exports = router