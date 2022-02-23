const router = require('express-promise-router')()
const passport = require('passport')
const passportSetup = require('../middlewares/passport')
const statictisController = require('../controllers/statictisController')

router.route('/monthly-statictis')
    .get(
        statictisController.getTotalRevenueOfMonth
    )

router.route('/yearly-statictis')
    .get(
        statictisController.getTotalRevenueOfYear
    )
    


// Export module
module.exports = router