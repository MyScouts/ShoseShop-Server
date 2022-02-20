const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const accountSchema = new Schema({
    AccountId: {
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
    RoleId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

accountSchema.plugin(aggregatePaginate);
const AccountModel = mongoose.model('accounts', accountSchema)

// Export module
module.exports = AccountModel