const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const bcrypt = require('bcryptjs')


// Create Schema
const accountSchema = new Schema({
    AccountId: {
        type: Number,
        required: true,
        unique: true
    },
    UserName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
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

accountSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.Password);
    } catch (error) {
        throw new Error(error)
    }
};


accountSchema.plugin(aggregatePaginate);
const AccountModel = mongoose.model('accounts', accountSchema)

// Export module
module.exports = AccountModel