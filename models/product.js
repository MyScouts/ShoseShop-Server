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
    }
}, {
    timestamps: true
})

productSchema.plugin(aggregatePaginate);
const ProductModel = mongoose.model('products', productSchema)

// Export module
module.exports = ProductModel
