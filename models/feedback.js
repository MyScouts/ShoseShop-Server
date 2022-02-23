const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const feedbackSchema = new Schema({
    FeedbackId: {
        type: Number,
        required: true,
        unique: true
    },
    CustomerId: {
        type: Number,
        required: true,
    },
    FeedbackName: {
        type: String,
    },
    FeedbackDescription: {
        type: String,
    },
    Grade: {
        type: Number,
    }
},{
    timestamps: true
})

feedbackSchema.plugin(aggregatePaginate);
const FeedbackModel = mongoose.model('feedbacks', feedbackSchema)
module.exports = FeedbackModel