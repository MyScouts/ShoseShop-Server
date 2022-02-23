const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const favoriteController = require('../controllers/favoriteController')
const favoriteSchemas = require('../validators/favotite')
const { validatorBody, validatorQuery, baseSchema } = require('../validators')
const isCustomer = require('../middlewares/isCustomer')


// 
router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        validatorBody(favoriteSchemas.createFavorite),
        favoriteController.createOrDeleteFavorite
    )

router.route('/my-favorites')
    .get(
        passport.authenticate('jwt', { session: false }),
        isCustomer,
        validatorQuery(baseSchema.page, 'page'),
        validatorQuery(baseSchema.pageSize, 'pageSize'),
        favoriteController.getMyFavorites
    )

module.exports = router