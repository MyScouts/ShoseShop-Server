const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const orderDetailSchema = new Schema({
    OrderId: {
        type: Number,
        required: true,
    },
    ProductId: {
        type: Number,
        required: true,
    },
    Quantity: {
        type: Number,
        required: true,
    },
    Size: {
        type: Number,
        required: true,
    },
    Color: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    PriceEach: {
        type: Number,
        required: true,
    },
    Discount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})

orderDetailSchema.plugin(aggregatePaginate);
const OrderDetailModel = mongoose.model('orderDetails', orderDetailSchema)
// Export Module/Schema
module.exports = OrderDetailModel