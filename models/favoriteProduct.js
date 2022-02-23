const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const favoriteProductSchema = new Schema({
    CustomerId: {
        type: Number,
        required: true,
    },
    ProductId: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

favoriteProductSchema.index({ CustomerId: 1, ProductId: 1 }, { unique: true });
favoriteProductSchema.plugin(aggregatePaginate);
const FavoriteProductModel = mongoose.model('favoriteProducts', favoriteProductSchema)
// Export Module/Schema
module.exports = FavoriteProductModel