const { responseSuccess } = require("../common/app")
const OrderModel = require("../models/order")
const OrderDetailModel = require("../models/orderDetail")
const ProductModel = require("../models/product")

const newOrder = async (req, res) => {
    const accountId = req.user.AccountId
    const { customerName, customerPhone, items, shipToAddress } = req.value.body

    const productIds = items.map(item => item.productId)

    const products = await ProductModel.find({ ProductId: { $in: productIds } })

    if (products.length !== productIds.length) return responseSuccess(res, 301, "Invalid productIds");

    const lastOrder = await OrderModel.findOne({}, {}, { sort: { 'OrderId': -1 } }).limit(1)

    const newOrder = await OrderModel.create({
        OrderId: lastOrder ? lastOrder.OrderId + 1 : 1,
        CustomerId: accountId,
        CustomerName: customerName,
        CustomerPhone: customerPhone,
        ShipToAddress: shipToAddress,
    })

    items.forEach(item => {
        await OrderDetailModel.create({
            OrderId: newOrder.OrderId,
            ProductId: item.productId,
            Quantity: item.quantity,
            PriceEach: products.find(product => product.ProductId === item.productId).Price,
        })
    })

    return responseSuccess(res, 200, "Create order success", newOrder)
}