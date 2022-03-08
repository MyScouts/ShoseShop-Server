const { responseSuccess, TIME_ZONE, pageConfig } = require("../common/app");
const ProductModel = require("../models/product");
const VoucherModel = require("../models/voucher");


const createVoucher = async (req, res) => {
    const { productId, startDate, endDate, status, voucherCode, type, discount_percentage, quantity } = req.body;
    const findVoucher = await VoucherModel.findOne({ VoucherCode: voucherCode });
    if (findVoucher) return responseSuccess(res, 301, "Voucher code is existed")
    const findProduct = await ProductModel.findOne({ ProductId: productId });
    if (!findProduct) return responseSuccess(res, 302, "Product is not existed")
    const checkExistVoucher = await VoucherModel.findOne({ ProductId: productId, StartDate: { $lte: new Date() }, EndDate: { $qte: new Date() } });
    console.log("🚀 ~ file: voucherController.js ~ line 16 ~ createVoucher ~ checkExistVoucher", checkExistVoucher)
    if (checkExistVoucher) return responseSuccess(res, 303, "Product is existed voucher")
    const lastVoucher = await VoucherModel.findOne({}, { VoucherId: 1 }).sort({ VoucherId: -1 });
    const voucher = await VoucherModel.create({
        VoucherId: lastVoucher && lastVoucher.VoucherId ? lastVoucher.VoucherId + 1 : 1,
        ProductId: productId,
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
        Status: status,
        VoucherCode: voucherCode,
        Type: type,
        Discount_percentage: discount_percentage,
        Quantity: quantity
    });
    return responseSuccess(res, 200, "Create voucher successfully", voucher);
}


const getAllVoucher = async (req, res) => {
    const { page, pageSize } = req.value.query;

    const voucherQuery = VoucherModel.aggregate([
        {
            $project: {
                VoucherId: 1,
                ProductId: 1,
                StartDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
                EndDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
                Status: 1,
                VoucherCode: 1,
                Type: 1,
                Discount_percentage: 1,
                Quantity: 1,
            }
        },
        {
            $sort: {
                VoucherId: -1
            }
        },
    ]);

    const vouchers = await VoucherModel.aggregatePaginate(voucherQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "Get all voucher successfully", vouchers);
}

const getVoucherOfProduct = async (req, res) => {
    const productId = req.params.productId;
    const { page, pageSize } = req.value.query;

    // check exits product
    const findProduct = await ProductModel.findOne({ ProductId: productId });
    if (!findProduct) return responseSuccess(res, 302, "Product is not existed")


    const voucherQuery = VoucherModel.aggregate([{
        $match: {
            $and: [
                { ProductId: parseInt(productId) },
                { StartDate: { $lte: new Date() } },
                { EndDate: { $gte: new Date() } },
                { Quantity: { $gt: 0 } }
            ]
        }
    },
    {
        $project: {
            VoucherId: 1,
            ProductId: 1,
            StartDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
            EndDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
            Status: 1,
            VoucherCode: 1,
            Type: 1,
            Discount_percentage: 1,
            Quantity: 1,
        }
    },
    {
        $sort: {
            VoucherId: -1
        }
    },
    ]);

    const vouchers = await VoucherModel.aggregatePaginate(voucherQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "Get all voucher successfully", vouchers);
}

const getVoucherDetail = async (req, res) => {
    const { voucherId } = req.params;
    const voucher = await VoucherModel.aggregate([
        {
            $match: {
                VoucherId: parseInt(voucherId)
            }
        },
        {
            $project: {
                VoucherId: 1,
                ProductId: 1,
                StartDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
                EndDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$EndDate", timezone: TIME_ZONE } },
                Status: 1,
                VoucherCode: 1,
                Type: 1,
                Discount_percentage: 1,
                Quantity: 1,
            }
        },
        {
            $sort: {
                VoucherId: -1
            }
        },
    ]);

    return responseSuccess(res, 200, voucher.length > 0 ? "Get voucher detail successfully" : "Voucher is not exits!", voucher.length > 0 ? voucher[0] : null);
}

const updateVoucher = async (req, res) => {
    const { VoucherId } = req.params;
    const { productId, startDate, endDate, status, voucherCode, type, discount_percentage, quantity } = req.body;
    const findVoucher = await VoucherModel.findOne({ VoucherCode: voucherCode });
    if (!findVoucher) return responseSuccess(res, 301, "Voucher code is'nt existed")
    const findProduct = await ProductModel.findOne({ ProductId: productId });
    if (!findProduct) return responseSuccess(res, 302, "Product is not existed")

    const voucher = await VoucherModel.findOneAndUpdate({ VoucherId: VoucherId }, {
        ProductId: productId,
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
        Status: status,
        VoucherCode: voucherCode,
        Type: type,
        Discount_percentage: discount_percentage,
        Quantity: quantity
    });
    return responseSuccess(res, 200, "Update voucher successfully", voucher);
}


const deleteVoucher = async (req, res) => {
    const { voucherId } = req.params;
    await VoucherModel.findOneAndDelete({ VoucherId: parseInt(voucherId) });
    return responseSuccess(res, 200, "Delete voucher successfully");
}

module.exports = {
    createVoucher,
    getAllVoucher,
    getVoucherOfProduct,
    updateVoucher,
    getVoucherDetail,
    deleteVoucher
}