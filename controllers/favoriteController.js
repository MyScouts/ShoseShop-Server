const { responseSuccess, pageConfig } = require("../common/app");
const FavoriteProductModel = require("../models/favoriteProduct");
const ProductModel = require("../models/product");


const createOrDeleteFavorite = async (req, res) => {
    const { productId } = req.value.body;
    const customerId = req.user.AccountId;

    // check exist product
    const existProduct = await ProductModel.findOne({ ProductId: productId });
    if (!existProduct) return responseSuccess(res, 301, "Product not exist");

    const favorite = await FavoriteProductModel.findOne({
        ProductId: productId,
        CustomerId: customerId
    });

    if (favorite) {
        await favorite.remove();
        return responseSuccess(res, 200, "Product removed from favorites");
    } else {
        const newFavorite = await FavoriteProductModel.create({
            ProductId: productId,
            CustomerId: customerId
        });
        return responseSuccess(res, 200, "Product added to favorites", newFavorite);
    }
}


const getMyFavorites = async (req, res) => {
    const customerId = req.user.AccountId;
    console.log("🚀 ~ file: favoriteController.js ~ line 34 ~ getMyFavorites ~ customerId", customerId)
    const { page, pageSize } = req.value.query;

    const favoriteQuery = FavoriteProductModel.aggregate([
        {
            $match: {
                CustomerId: customerId
            }
        },
        {
            $lookup: {
                from: "products",
                as: "product",
                let: { productId: "$ProductId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$ProductId", "$$productId"]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "categories",
                            foreignField: "CategoryId",
                            localField: "CategoryId",
                            as: "Category"
                        }
                    }, {
                        $project: {
                            _id: 0,
                            ProductId: 1,
                            ProductName: 1,
                            Price: { $toDouble: "$Price" },
                            Category: {
                                CategoryId: 1,
                                CategoryName: 1,
                                CategoryDescription: 1,

                            }
                        }
                    }
                ]
            }
        }, {
            $project: {
                _id: 0,
                CustomerId: 1,
                ProductId: 1,
                Product: { $arrayElemAt: ["$product", 0] }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);


    const favoriteProducts = await FavoriteProductModel.aggregatePaginate(favoriteQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "Get my favorite products successfully!", favoriteProducts);
}

// Export module
module.exports = {
    createOrDeleteFavorite,
    getMyFavorites
}