const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const accountInfo = new Schema({
    AccountId: {
        type: Number,
        required: true,
        unique: true
    },
    FullName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
    },
    Address: {
        type: String,
    },
    Sex: {
        type: Number,
        required: true,
        enum: [0, 1, 2] // 0: Nữ, 1: Name, 2: không xác định
    },
}, {
    timestamps: true,

    toJSON: {
        getters: true,
        transform: (doc, ret) => {
            ret.createdAt = ret.createdAt ? ret.createdAt.toISOString() : null
            ret.updatedAt = ret.updatedAt ? ret.updatedAt.toISOString() : null
            delete ret.__v
            delete ret.logical_delete
            return ret;
        },
    }
})

accountInfo.plugin(aggregatePaginate);
const AccountInfo = mongoose.model('customers', accountInfo)
module.exports = AccountInfo