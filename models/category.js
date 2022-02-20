const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const categorySchema = new Schema({
    CategoryId: {
        type: Number,
        required: true,
        unique: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    CategoryDescription: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

categorySchema.plugin(aggregatePaginate);
const CategoryModel = mongoose.model('categories', categorySchema)

// Export module
module.exports = CategoryModel