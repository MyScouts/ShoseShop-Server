const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;


const voucherSchema = new Schema({
    VoucherId: {
        type: Number,
        required: true,
    },
    ProductId: {
        type: Number,
        required: true,
    },
    StartDate: {
        type: Date,
        required: true
    },
    EndDate: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
    },
    VoucherCode: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    Type: {
        type: String,
    },
    Discount_percentage: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

voucherSchema.plugin(aggregatePaginate);
voucherSchema.index({ VoucherId: 1, productId: 1 }, { unique: true });
const VoucherModel = mongoose.model('vouchers', voucherSchema);

// Export module
module.exports = VoucherModel;