const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const orderSchema = new Schema({
    OrderId: {
        type: Number,
        required: true,
        unique: true
    },
    CustomerId: {
        type: Number,
        required: true,
    },
    CustomerPhone: {
        type: String,
        required: true,
    },
    OrderDate: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: Number,
        default: 0,
        // 0: Đang chờ xử lý
        // 1: Đang giao hàng
        // 2: Đã giao hàng
        // 3: Đã hủy
    },
    ShipToAddress: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

orderSchema.index({ OrderId: 1 }, { unique: true });
orderSchema.plugin(aggregatePaginate);

const OrderModel = mongoose.model('orders', orderSchema)
// Export Module/Schema
module.exports = OrderModel