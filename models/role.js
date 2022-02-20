const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create Schema
const roleSchema = new Schema({
    RoleId: {
        type: Number,
        required: true,
        unique: true
    },
    RoleName: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

roleSchema.plugin(aggregatePaginate);
const RoleModel = mongoose.model('roles', roleSchema)
module.exports = RoleModel