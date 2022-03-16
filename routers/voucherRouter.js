const router = require('express-promise-router')()
const voucherController = require('../controllers/voucherController')
const { validatorBody, validatorQuery, baseSchema } = require('../validators')
const voucherSchema = require('../validators/voucher')
// 
router.route('/')
    .post(
        validatorBody(voucherSchema.createVoucher),
        voucherController.createVoucher)
    .get(
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        voucherController.getAllVoucher
    )

router.route('/:voucherId')
    .get(
        voucherController.getVoucherDetail
    )
    .post(
        validatorBody(voucherSchema.createVoucher),
        voucherController.updateVoucher)
    .delete(
        voucherController.deleteVoucher
    )
// 
router.route('/product/:productId')
    .get(
        validatorQuery(baseSchema.page, "page"),
        validatorQuery(baseSchema.pageSize, "pageSize"),
        voucherController.getVoucherOfProduct
    )

module.exports = router