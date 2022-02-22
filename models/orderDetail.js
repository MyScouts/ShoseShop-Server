const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const orderDetailSchema = new Schema({
    OrderDetailId: {
        type: Number,
        required: true,
        unique: true
    },
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
    PriceEach: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

orderDetailSchema.index({ OrderDetailId: 1 }, { unique: true });
orderDetailSchema.plugin(aggregatePaginate);

const OrderDetailModel = mongoose.model('orderDetails', orderDetailSchema)
// Export Module/Schema
module.exports = OrderDetailModel