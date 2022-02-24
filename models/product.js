const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const productSchema = new Schema({
    ProductId: {
        type: Number,
        required: true,
        unique: true
    },
    ProductName: {
        type: String,
        required: true
    },
    Price: {
        type: mongoose.Decimal128,
        required: true
    },
    Sizes: {
        type: Array,
        required: true
    },
    ProductImage: {
        type: String,
        required: true
    },
    CategoryId: {
        type: Number,
        required: true
    },
    StorageQuantity: {
        type: Number,
        required: true
    },
    ProductDescription: {
        type: String,
    },
    ProductStatus: {
        type: Number,
        default: 1
        // 0: stop selling  1: selling
    },
}, {
    timestamps: true
})

productSchema.plugin(aggregatePaginate);
productSchema.index({ ProductId: 1 }, { unique: true });
const ProductModel = mongoose.model('products', productSchema)

// Export module
module.exports = ProductModel
