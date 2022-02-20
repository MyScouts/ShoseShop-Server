const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const accountInfo = new Schema({
    CustomerId: {
        type: Number,
        required: true,
        unique: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    FirstName: {
        type: String,
    },
    LastName: {
        type: String,
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
    RoleId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

accountInfo.plugin(aggregatePaginate);
const AccountInfo = mongoose.model('customers', accountInfo)
module.exports = AccountInfo