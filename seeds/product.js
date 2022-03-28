const faker = require('faker')
const ProductModel = require('../models/product')
// Seed categories

const sizes1 = [29, 30, 31, 32]
const sizes2 = [33, 34, 35, 36]
const size3 = [41, 42, 43, 44]
const sizes4 = [45, 46, 47, 48]

const arras = [sizes1, sizes2, size3, sizes4]

const categorySeed = async () => {
    for (i = 0; i < 50; i++) {

        const maxProduct = await ProductModel.find({}).sort({ ProductId: -1 }).limit(1)
        //
        // await new ProductModel({
        //     ProductId: maxProduct !== null && maxProduct.length > 0 ? maxProduct[0].ProductId + 1 : 1,
        //     ProductName: faker.commerce.productName(),
        //     Price: faker.finance.amount(100, 1000, 2),
        //     Sizes: arras[Math.floor(Math.random() * arras.length)],
        //     ProductImage: faker.image.image(),
        //     CategoryId: Math.floor(Math.random() * 20),
        //     StorageQuantity: Math.floor(Math.random() * 5000)
        // }).save()
    }
}

// Export module
module.exports = categorySeed