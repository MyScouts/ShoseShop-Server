const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const attributeSchema = new Schema({
    AttributeId: {
        type: Number,
        required: true,
        unique: true
    },
    ProductId: {
        type: Number,
        required: true
    },
    AttributeName: {
        type: String,
        required: true
    },
    AttributeDescription: {
        type: String,
        required: true
    },
    AttributeImage: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

attributeSchema.plugin(aggregatePaginate);
const AttributeModel = mongoose.model('attributes', attributeSchema)

// Export module
module.exports = AttributeModel