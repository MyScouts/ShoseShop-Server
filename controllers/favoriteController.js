const { responseSuccess } = require("../common/app");
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

// Export module
module.exports = {
    createOrDeleteFavorite
}