const { pageConfig, responseSuccess } = require("../common/app");
const ProductModel = require("../models/product");
const { converterServerToRealPath } = require("../utils/fileUpload");

// Get all products
const getAllProducts = async (req, res) => {
    const { page, pageSize, search } = req.value.query;
    let condition = {};
    let condictionCategory = {};

    if (search && search !== '') {
        condition = {
            $or: [
                { ProductName: { $regex: new RegExp(`.*${search}.*`), $options: 'i' } },
                // { Price: { $regex: new RegExp(search), $options: 'i' } },
            ]

        };
        condictionCategory = { CategoryName: { $regex: `.*${search}.*`, $options: 'i' } }
    }

    const productQuery = ProductModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "CategoryId",
                foreignField: "CategoryId",
                pipeline: [
                    { $match: condictionCategory }
                ],
                as: "category",
            },
        }, {
            $lookup: {
                from: "attributes",
                localField: "ProductId",
                foreignField: "ProductId",
                as: "attributes",
            },
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: condition,
        },
        {
            $project: {
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                category: {
                    CategoryId: 1,
                    CategoryName: 1,
                    CategoryDescription: 1,
                    CategoryImage: 1,
                },
                attributes: {
                    AttributeId: 1,
                    AttributeName: 1,
                    AttributeDescription: 1,
                    AttributeImage: 1,
                },
            },
        },
    ]);

    const products = await ProductModel.aggregatePaginate(productQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "", products);
}

// Get detail product
const getDetailProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.aggregate([
        {
            $match: {
                ProductId: parseInt(productId),
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "CategoryId",
                foreignField: "CategoryId",
                as: "category",
            },
        }, {
            $lookup: {
                from: "attributes",
                localField: "ProductId",
                foreignField: "ProductId",
                as: "attributes",
            },
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: "$attributes",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                category: {
                    CategoryId: 1,
                    CategoryName: 1,
                    CategoryDescription: 1,
                    CategoryImage: 1,
                },
                attributes: {
                    AttributeId: 1,
                    AttributeName: 1,
                    AttributeDescription: 1,
                    AttributeImage: 1,
                },
            },
        },
    ]);
    return responseSuccess(res, 200, "", product);
}

// create product
const createProduct = async (req, res) => {
    const { productName, price, sizes, categoryId, storageQuantity } = req.value.body;
    if (req.file) {
        const maxProduct = await ProductModel.find({}).sort({ ProductId: -1 }).limit(1)
        const product = await ProductModel.create({
            ProductId: maxProduct !== null && maxProduct.length > 0 ? maxProduct[0].ProductId + 1 : 1,
            ProductName: productName,
            Price: price,
            Sizes: sizes,
            ProductImage: converterServerToRealPath(req.file.path),
            CategoryId: categoryId,
            StorageQuantity: storageQuantity,
        });
        return responseSuccess(res, 200, "", product);
    } else {
        return responseSuccess(res, 301, "", "Please upload image");
    }
}

// update product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { productName, price, sizes, categoryId, storageQuantity } = req.value.body;
    const product = await ProductModel.findOne({ ProductId: parseInt(productId) });

    if (product) {
        if (req.file) {
            product.ProductImage = converterServerToRealPath(req.file.path);
        }
        product.ProductName = productName;
        product.Price = price;
        product.Sizes = sizes;
        product.CategoryId = categoryId;
        product.StorageQuantity = storageQuantity;
        await product.save();
        return responseSuccess(res, 200, "", product);
    }
    return responseSuccess(res, 301, "", "Product not found");
}

// delete product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ ProductId: parseInt(productId) });
    if (product) {
        await product.remove();
        return responseSuccess(res, 200, "", "Delete product success");
    }
    return responseSuccess(res, 301, "", "Product not found");
}

module.exports = {
    getAllProducts,
    getDetailProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}