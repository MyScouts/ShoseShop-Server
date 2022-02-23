const { responseSuccess } = require("../common/app");
const OrderModel = require("../models/order");
const ProductModel = require("../models/product");

const getTotalRevenueOfMonth = async (req, res) => {
    const { month, year, filter } = req.query;
    // filter: 1: revenue product, 2: best selling, 3:  sell poorly
    let sort = {}

    if (parseInt(filter) === 1) {
        sort = {
            $sort: {
                TotalRevenue: -1,
            },
        }
    } else if (parseInt(filter) === 2) {
        sort = {
            $sort: {
                TotalSold: -1,
            },
        }
    } else if (parseInt(filter) === 3) {
        sort = {
            $sort: {
                TotalSold: 1,
            },
        }
    } else {
        return responseSuccess(res, 301, "Invalid filter");
    }


    // const customerId = req.user.AccountId;
    const favoriteQuery = await ProductModel.aggregate([
        {
            $lookup: {
                from: "orders",
                as: "orders",
                let: { o: "$OrderId" },
                pipeline: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(`${year}-${month}-01`),
                                $lte: new Date(`${year}-${month}-31`)
                            },
                        }
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            as: "orderdetails",
                            let: { o: "$OrderId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$OrderId", "$$o"] },
                                            ]
                                        }
                                    }
                                }
                            ],
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                TotalSold: {
                    $sum: {
                        $map: {
                            input: "$orders",
                            as: "order",
                            in: {
                                $sum: {
                                    $map: {
                                        input: "$$order.orderdetails",
                                        as: "orderdetail",
                                        in: {
                                            $cond: {
                                                if: { $eq: ["$$orderdetail.ProductId", "$ProductId"] },
                                                then: "$$orderdetail.Quantity",
                                                else: 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                TotalOrders: {
                    $sum: {
                        $map: {
                            input: "$orders",
                            as: "order",
                            in: {
                                $sum: {
                                    $map: {
                                        input: "$$order.orderdetails",
                                        as: "orderdetail",
                                        in: {
                                            $cond: {
                                                if: { $eq: ["$$orderdetail.ProductId", "$ProductId"] },
                                                then: 1,
                                                else: 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                TotalSold: 1,
                TotalOrders: 1,
                orders: { $size: "$orders" },
            },
        }, {
            $addFields: {
                TotalRevenue: {
                    $multiply: [
                        "$TotalSold",
                        "$Price"
                    ]
                }
            }
        },
        sort
    ]);

    return responseSuccess(res, 200, "", favoriteQuery);
}


const getTotalRevenueOfYear = async (req, res) => {
    const {year, filter } = req.query;
    // filter: 1: revenue product, 2: best selling, 3:  sell poorly
    let sort = {}

    if (parseInt(filter) === 1) {
        sort = {
            $sort: {
                TotalRevenue: -1,
            },
        }
    } else if (parseInt(filter) === 2) {
        sort = {
            $sort: {
                TotalSold: -1,
            },
        }
    } else if (parseInt(filter) === 3) {
        sort = {
            $sort: {
                TotalSold: 1,
            },
        }
    } else {
        return responseSuccess(res, 301, "Invalid filter");
    }


    // const customerId = req.user.AccountId;
    const favoriteQuery = await ProductModel.aggregate([
        {
            $lookup: {
                from: "orders",
                as: "orders",
                let: { o: "$OrderId" },
                pipeline: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(`${year}-01-01`),
                                $lte: new Date(`${year}-12-31`)
                            },
                        }
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            as: "orderdetails",
                            let: { o: "$OrderId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$OrderId", "$$o"] },
                                            ]
                                        }
                                    }
                                }
                            ],
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                TotalSold: {
                    $sum: {
                        $map: {
                            input: "$orders",
                            as: "order",
                            in: {
                                $sum: {
                                    $map: {
                                        input: "$$order.orderdetails",
                                        as: "orderdetail",
                                        in: {
                                            $cond: {
                                                if: { $eq: ["$$orderdetail.ProductId", "$ProductId"] },
                                                then: "$$orderdetail.Quantity",
                                                else: 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                TotalOrders: {
                    $sum: {
                        $map: {
                            input: "$orders",
                            as: "order",
                            in: {
                                $sum: {
                                    $map: {
                                        input: "$$order.orderdetails",
                                        as: "orderdetail",
                                        in: {
                                            $cond: {
                                                if: { $eq: ["$$orderdetail.ProductId", "$ProductId"] },
                                                then: 1,
                                                else: 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                TotalSold: 1,
                TotalOrders: 1,
                orders: { $size: "$orders" },
            },
        }, {
            $addFields: {
                TotalRevenue: {
                    $multiply: [
                        "$TotalSold",
                        "$Price"
                    ]
                }
            }
        },
        sort
    ]);

    return responseSuccess(res, 200, "", favoriteQuery);
}

module.exports = {
    getTotalRevenueOfMonth,
    getTotalRevenueOfYear,
}