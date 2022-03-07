const { pageConfig, responseSuccess } = require("../common/app");
const AttributeModel = require("../models/attribute");
const ProductModel = require("../models/product");
const { converterServerToRealPath } = require("../utils/fileUpload");

// Get all products
const getAllProducts = async(req, res) => {
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

    const productQuery = ProductModel.aggregate([{
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
                ProductDescription: 1,
                ProductStatus: 1,
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
const getDetailProduct = async(req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.aggregate([{
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
            $project: {
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                ProductDescription: 1,
                ProductStatus: 1,
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
    if (product.length > 0) {
        return responseSuccess(res, 200, "", product[0]);
    } else {
        return responseSuccess(res, 301, "", "Product not found");
    }
}

// create product
const createProduct = async(req, res) => {
    const { productName, price, sizes, categoryId, storageQuantity, productDescription } = req.value.body;
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
            ProductDescription: productDescription,
        });
        return responseSuccess(res, 200, "", product);
    } else {
        return responseSuccess(res, 301, "", "Please upload image");
    }
}

// update product
const updateProduct = async(req, res) => {
    const { productId } = req.params;
    const { productName, price, sizes, categoryId, storageQuantity, productDescription } = req.value.body;
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
        product.ProductDescription = productDescription;
        await product.save();
        return responseSuccess(res, 200, "", product);
    }
    return responseSuccess(res, 301, "", "Product not found");
}

// delete product
const deleteProduct = async(req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ ProductId: parseInt(productId) });
    if (product) {
        await product.remove();
        return responseSuccess(res, 200, "", "Delete product success");
    }
    return responseSuccess(res, 301, "", "Product not found");
}

// get attributes of product
const getAttributes = async(req, res) => {
    const { productId } = req.params;

    const attributes = await AttributeModel.aggregate([{
            $match: {
                ProductId: parseInt(productId),
            },
        },
        {
            $project: {
                AttributeId: 1,
                AttributeName: 1,
                AttributeDescription: 1,
                AttributeImage: 1,
            },
        },
    ]);
    return responseSuccess(res, 200, "", attributes);
}

// create attribute
const createAttribute = async(req, res) => {
    const { productId } = req.params;
    const { attributeName, attributeDescription } = req.value.body;
    if (req.file) {
        const maxAttribute = await AttributeModel.find({}).sort({ AttributeId: -1 }).limit(1)
        const attribute = await AttributeModel.create({
            AttributeId: maxAttribute !== null && maxAttribute.length > 0 ? maxAttribute[0].AttributeId + 1 : 1,
            ProductId: parseInt(productId),
            AttributeName: attributeName,
            AttributeDescription: attributeDescription,
            AttributeImage: converterServerToRealPath(req.file.path),
        });
        return responseSuccess(res, 200, "", attribute);
    } else {
        return responseSuccess(res, 301, "", "Please upload image");
    }
}

// update attribute
const updateAttribute = async(req, res) => {
    const { attributeId } = req.params;
    const { attributeName, attributeDescription } = req.value.body;
    const attribute = await AttributeModel.findOne({ AttributeId: parseInt(attributeId) });
    if (attribute) {
        if (req.file) {
            attribute.AttributeImage = converterServerToRealPath(req.file.path);
        }
        attribute.AttributeName = attributeName;
        attribute.AttributeDescription = attributeDescription;
        await attribute.save();
        return responseSuccess(res, 200, "", attribute);
    }
    return responseSuccess(res, 301, "", "Attribute not found");
}

// get attribute detail
const getAttribute = async(req, res) => {
    const { attributeId } = req.params;
    const attribute = await AttributeModel.findOne({ AttributeId: parseInt(attributeId) });
    if (attribute) {
        return responseSuccess(res, 200, "", attribute);
    }
    return responseSuccess(res, 301, "", "Attribute not found");
}

// delete attribute
const deleteAttribute = async(req, res) => {
    const { attributeId } = req.params;
    const attribute = await AttributeModel.findOne({ AttributeId: parseInt(attributeId) });
    if (attribute) {
        await attribute.remove();
        return responseSuccess(res, 200, "", "Delete attribute success");
    }
    return responseSuccess(res, 301, "", "Attribute not found");
}

// get products by category
const getProductsByCategory = async(req, res) => {
    const { page, pageSize } = req.value.query;
    const { categoryId } = req.params;
    const productQuery = ProductModel.aggregate([{
            $match: {
                CategoryId: parseInt(categoryId),
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
            $project: {
                ProductId: 1,
                ProductName: 1,
                Price: { $toDouble: "$Price" },
                Sizes: 1,
                ProductImage: 1,
                CategoryId: 1,
                StorageQuantity: 1,
                ProductDescription: 1,
                ProductStatus: 1,
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

const getBestSellingProducts = async(req, res) => {
    const { page, pageSize } = req.value.query;
    const productQuery = ProductModel.aggregate([{
            $lookup: {
                from: "categories",
                localField: "CategoryId",
                foreignField: "CategoryId",
                as: "category",
            },
        },
        {
            $lookup: {
                from: "attributes",
                localField: "ProductId",
                foreignField: "ProductId",
                as: "attributes",
            },
        },
        {
            $lookup: {
                from: "orderdetails",
                localField: "ProductId",
                foreignField: "ProductId",
                as: "orderdetails",
            },
        },
        {
            $addFields: {
                TotalSold: {
                    $sum: "$orderdetails.Quantity",
                },
            }
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
                ProductDescription: 1,
                ProductStatus: 1,
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
                TotalSold: 1,
            },
        },
        {
            $sort: {
                TotalSold: -1,
            },
        },
    ]);

    const products = await ProductModel.aggregatePaginate(productQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "", products);
}



module.exports = {
    getAllProducts,
    getDetailProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAttributes,
    createAttribute,
    updateAttribute,
    getAttribute,
    deleteAttribute,
    getProductsByCategory,
    getBestSellingProducts,
}