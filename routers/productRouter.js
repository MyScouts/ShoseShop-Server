const router = require('express-promise-router')()
const { validatorQuery, baseSchema, validatorBody } = require('../validators')
const productController = require('../controllers/productController')
const multer = require('multer')
const { storage, imageFilter } = require('../utils/fileUpload')
const productSchemas = require('../validators/product')
const attributeSchemas = require('../validators/attribute')
const passportConfig = require('../middlewares/passport')
const passport = require('passport')
const isManager = require('../middlewares/isManager')

// Router body
router.route('/get-all')
    .get(
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        validatorQuery(baseSchema.search, "search"),
        productController.getAllProducts
    )

router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        isManager,
        multer({ storage: storage, fileFilter: imageFilter }).single('productImage'),
        validatorBody(productSchemas.createProduct), productController.createProduct
    )

router.route('/:productId')
    .get(
        productController.getDetailProduct
    )
    .put(
        passport.authenticate('jwt', { session: false }),
        isManager,
        multer({ storage: storage, fileFilter: imageFilter }).single('productImage'),
        validatorBody(productSchemas.createProduct),
        productController.updateProduct
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        isManager,
        productController.deleteProduct
    )

router.route('/:productId/attributes')
    .get(
        productController.getAttributes
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        isManager,
        multer({ storage: storage, fileFilter: imageFilter }).single('attributeImage'),
        validatorBody(attributeSchemas.createAttribute),
        productController.createAttribute
    )

router.route('/:productId/attributes/:attributeId')
    .get(
        productController.getAttribute
    )
    .put(
        passport.authenticate('jwt', { session: false }),
        isManager,
        multer({ storage: storage, fileFilter: imageFilter }).single('attributeImage'),
        validatorBody(attributeSchemas.createAttribute), productController.updateAttribute
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        isManager,
        productController.deleteAttribute
    )

router.route('/category/:categoryId')
    .get(
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        productController.getProductsByCategory
    )

// Export module
module.exports = router