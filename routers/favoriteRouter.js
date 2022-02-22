const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const favoriteController = require('../controllers/favoriteController')
const favoriteSchemas = require('../validators/favotite')
const { validatorBody } = require('../validators')


// 
router.route('/')
    .post(
        passport.authenticate('jwt', { session: false }),
        validatorBody(favoriteSchemas.createFavorite),
        favoriteController.createOrDeleteFavorite
    )


module.exports = router