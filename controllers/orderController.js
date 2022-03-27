const { responseSuccess, pageConfig, TIME_ZONE } = require("../common/app")
const OrderModel = require("../models/order")
const OrderDetailModel = require("../models/orderDetail")
const ProductModel = require("../models/product")
const VoucherModel = require("../models/voucher")

const newOrder = async (req, res) => {
    const accountId = req.user.AccountId
    const { customerName, customerPhone, items, shipToAddress } = req.value.body

    const productIds = items.map(item => item.productId)
    const products = await ProductModel.find({ ProductId: { $in: productIds } })
    if (products.length !== productIds.length) return responseSuccess(res, 301, "Invalid productIds");

    // check enough quantity
    products.map(product => {
        const productInCart = items.find(item => item.productId === product.ProductId)
        if (productInCart.quantity > product.Quantity) return responseSuccess(res, 302, "Not enough quantity");
    })


    const lastOrder = await OrderModel.find({}).sort({ OrderId: -1 }).limit(1)

    const newOrder = await OrderModel.create({
        OrderId: lastOrder && lastOrder.length > 0 ? lastOrder[0].OrderId + 1 : 1,
        CustomerId: accountId,
        CustomerName: customerName,
        CustomerPhone: customerPhone,
        ShipToAddress: shipToAddress,
    })

    items.forEach(async (item) => {
        const checkExistVoucher = await VoucherModel.findOne({ ProductId: item.productId, StartDate: { $lte: new Date() }, EndDate: { $gte: new Date() }, Quantity: { $gt: 0 } });
        if (checkExistVoucher) {
            checkExistVoucher.Quantity = checkExistVoucher.Quantity - 1
            await checkExistVoucher.save()
        }
        await OrderDetailModel.create({
            OrderId: newOrder.OrderId,
            ProductId: item.productId,
            Quantity: item.quantity,
            Size: item.size,
            Color: item.color,
            Price: products.find(product => product.ProductId === item.productId).Price,
            Discount: checkExistVoucher ? checkExistVoucher.Discount_percentage : 0,
            VoucherId: checkExistVoucher ? checkExistVoucher.VoucherId : 0
        })
        // update product
        await ProductModel.updateOne({ ProductId: item.productId }, {
            $inc: { StorageQuantity: -item.quantity }
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
        }, {
            $lookup: {
                from: "customers",
                foreignField: "AccountId",
                localField: "CustomerId",
                as: "customers"
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
                                },

                            ]
                        }
                    }, {
                        $lookup: {
                            from: "vouchers",
                            foreignField: "VoucherId",
                            localField: "VoucherId",
                            as: "vouchers"
                        }
                    },
                    {
                        $project: {
                            OrderId: 1,
                            Quantity: 1,
                            Size: 1,
                            Color: 1,
                            Price: 1,
                            Discount: 1,
                            Voucher: { $arrayElemAt: ["$vouchers", 0] },
                            Total: { $sum: { $multiply: ["$Price", "$Quantity"] } },
                            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } },
                            updatedAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } }
                        }
                    },
                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                CustomerId: 1,
                OrderDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$OrderDate", timezone: TIME_ZONE } },
                OrderStatus: 1,
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
                Status: 1,
                CustomerName: { $arrayElemAt: ["$customers.FullName", 0] }
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.Total"
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
                from: "customers",
                foreignField: "AccountId",
                localField: "CustomerId",
                as: "customers"
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
                                },

                            ]
                        }
                    }, {
                        $lookup: {
                            from: "vouchers",
                            foreignField: "VoucherId",
                            localField: "VoucherId",
                            as: "vouchers"
                        }
                    },
                    {
                        $project: {
                            OrderId: 1,
                            Quantity: 1,
                            Size: 1,
                            Color: 1,
                            Price: 1,
                            Discount: 1,
                            Voucher: { $arrayElemAt: ["$vouchers", 0] },
                            Total: { $sum: { $multiply: ["$Price", "$Quantity"] } },
                            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } },
                            updatedAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } }
                        }
                    },
                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                CustomerId: 1,
                CustomerName: { $arrayElemAt: ["$customers.FullName", 0] },
                OrderDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$OrderDate", timezone: TIME_ZONE } },
                OrderStatus: 1,
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
                Status: 1,
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.Total"
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

const getAllOrders = async (req, res) => {
    const { page, pageSize } = req.value.query;
    const orderQuery = OrderModel.aggregate([
        {
            $lookup: {
                from: "customers",
                foreignField: "AccountId",
                localField: "CustomerId",
                as: "customers"
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
                                },

                            ]
                        }
                    }, {
                        $lookup: {
                            from: "vouchers",
                            foreignField: "VoucherId",
                            localField: "VoucherId",
                            as: "vouchers"
                        }
                    },
                    {
                        $project: {
                            OrderId: 1,
                            Quantity: 1,
                            Size: 1,
                            Color: 1,
                            Price: 1,
                            Discount: 1,
                            Voucher: { $arrayElemAt: ["$vouchers", 0] },
                            Total: { $sum: { $multiply: ["$Price", "$Quantity"] } },
                            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } },
                            updatedAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } }
                        }
                    },
                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                CustomerId: 1,
                CustomerName: { $arrayElemAt: ["$customers.FullName", 0] },
                OrderDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$OrderDate", timezone: TIME_ZONE } },
                OrderStatus: 1,
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
                Status: 1,
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.Total"
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


const getOrderDetail = async (req, res) => {
    const { orderId } = req.params

    const orders = await OrderModel.aggregate([
        {
            $match: {
                OrderId: parseInt(orderId),
            }
        },
        {
            $lookup: {
                from: "customers",
                foreignField: "AccountId",
                localField: "CustomerId",
                as: "customers"
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
                                },

                            ]
                        }
                    }, {
                        $lookup: {
                            from: "vouchers",
                            foreignField: "VoucherId",
                            localField: "VoucherId",
                            as: "vouchers"
                        }
                    },
                    {
                        $project: {
                            OrderId: 1,
                            Quantity: 1,
                            Size: 1,
                            Color: 1,
                            Price: 1,
                            Discount: 1,
                            Voucher: { $arrayElemAt: ["$vouchers", 0] },
                            Total: { $sum: { $multiply: ["$Price", "$Quantity"] } },
                            createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } },
                            updatedAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } }
                        }
                    },
                ]
            }
        },
        {
            $project: {
                OrderId: 1,
                CustomerId: 1,
                OrderDate: { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$OrderDate", timezone: TIME_ZONE } },
                OrderStatus: 1,
                CustomerName: { $arrayElemAt: ["$customers.FullName", 0] },
                CustomerPhone: 1,
                ShipToAddress: 1,
                orderDetails: 1,
                Status: 1,
            }
        },
        {
            $addFields: {
                Total: {
                    $sum: "$orderDetails.Total"
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

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.value.body

    const order = await OrderModel.findOneAndUpdate({ OrderId: parseInt(orderId) }, { Status: status }, { new: true })
    if (!order) {
        return responseSuccess(res, 301, "Order not found")
    }
    return responseSuccess(res, 200, "Update order status success", order)
}

// Export module
module.exports = {
    newOrder,
    getMyOrders,
    getMyOrderDetail,
    getAllOrders,
    getOrderDetail,
    updateOrderStatus,
}