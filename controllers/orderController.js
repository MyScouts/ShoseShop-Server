const { responseSuccess, pageConfig } = require("../common/app")
const OrderModel = require("../models/order")
const OrderDetailModel = require("../models/orderDetail")
const ProductModel = require("../models/product")

const newOrder = async (req, res) => {
    const accountId = req.user.AccountId
    const { customerName, customerPhone, items, shipToAddress } = req.value.body
    console.log("🚀 ~ file: orderController.js ~ line 9 ~ newOrder ~ items", items)

    const productIds = items.map(item => item.productId)
    const products = await ProductModel.find({ ProductId: { $in: productIds } })
    if (products.length !== productIds.length) return responseSuccess(res, 301, "Invalid productIds");

    const lastOrder = await OrderModel.find({}).sort({ OrderId: -1 }).limit(1)

    const newOrder = await OrderModel.create({
        OrderId: lastOrder && lastOrder.length > 0 ? lastOrder[0].OrderId + 1 : 1,
        CustomerId: accountId,
        CustomerName: customerName,
        CustomerPhone: customerPhone,
        ShipToAddress: shipToAddress,
    })

    items.forEach(async (item) => {
        await OrderDetailModel.create({
            OrderId: newOrder.OrderId,
            ProductId: item.productId,
            Quantity: item.quantity,
            PriceEach: products.find(product => product.ProductId === item.productId).Price * item.quantity,
        })
    })

    return responseSuccess(res, 200, "Create order success", newOrder)
}


const getMyOrders = async (req, res) => {
    const accountId = req.user.AccountId
    const { page, pageSize } = req.value.query;
    const orderQuery = OrderModel.aggregate([
        {
            $match: {
                CustomerId: accountId,
            }
        },
        {
            $lookup: {
                from: "orderdetails",
                as: "orderDetails",
                let: { orderId: "$OrderId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$OrderId", "$$orderId"] },
                                ]
                            }
                        }
                    }, {
                        $lookup: {
                            from: "products",
                            as: "product",
                            let: { productId: "$ProductId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$ProductId", "$$productId"] },
                                            ]
                                        }
                                    }
                                }, {
                                    $lookup: {
                                        from: "categories",
                                        foreignField: "CategoryId",
                                        localField: "CategoryId",
                                        as: "category"
                                    }
                                }, {
                                    $project: {
                                        _id: 0,
                                        ProductId: 1,
                                        ProductName: 1,
                                        Price: { $toDouble: "$Price" },
                                        Sizes: 1,
                                        ProductImage: 1,
                                        CategoryId: 1,
                                        category: {
                                            CategoryId: 1,
                                            CategoryName: 1,
                                            CategoryDescription: 1,
                                        }
                                    }
                                }
                            ]
                        }
                    },

                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                OrderDate: 1,
                OrderStatus: 1,
                CustomerName: 1,
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.PriceEach"
                }
            }
        },
        {
            $sort: {
                OrderId: -1
            }
        }
    ])

    const orders = await OrderModel.aggregatePaginate(orderQuery, pageConfig(page, pageSize))
    return responseSuccess(res, 200, "Get orders success", orders)
}

const getMyOrderDetail = async (req, res) => {
    const accountId = req.user.AccountId
    const { orderId } = req.params

    const orders = await OrderModel.aggregate([
        {
            $match: {
                CustomerId: accountId,
                OrderId: parseInt(orderId),
            }
        },
        {
            $lookup: {
                from: "orderdetails",
                as: "orderDetails",
                let: { orderId: "$OrderId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$OrderId", "$$orderId"] },
                                ]
                            }
                        }
                    }, {
                        $lookup: {
                            from: "products",
                            as: "product",
                            let: { productId: "$ProductId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$ProductId", "$$productId"] },
                                            ]
                                        }
                                    }
                                }, {
                                    $lookup: {
                                        from: "categories",
                                        foreignField: "CategoryId",
                                        localField: "CategoryId",
                                        as: "category"
                                    }
                                }, {
                                    $project: {
                                        _id: 0,
                                        ProductId: 1,
                                        ProductName: 1,
                                        Price: { $toDouble: "$Price" },
                                        Sizes: 1,
                                        ProductImage: 1,
                                        CategoryId: 1,
                                        category: {
                                            CategoryId: 1,
                                            CategoryName: 1,
                                            CategoryDescription: 1,
                                        }
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                OrderDate: 1,
                OrderStatus: 1,
                CustomerName: 1,
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.PriceEach"
                }
            }
        },
        {
            $sort: {
                OrderId: -1
            }
        }
    ])

    return responseSuccess(res, 200, "Get orders success", orders)
}

// Export module
module.exports = {
    newOrder,
    getMyOrders,
    getMyOrderDetail
}