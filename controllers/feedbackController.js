const { responseSuccess, pageConfig, TIME_ZONE } = require("../common/app");
const FeedbackModel = require("../models/feedback");


// Create a new feedback
const newFeedBack = async (req, res) => {
    const customerId = req.user.AccountId;
    const { feedbackName, feedbackDescription, grade } = req.value.body;

    const lastFeedback = await FeedbackModel.find({}).sort({ FeedbackId: -1 }).limit(1);

    const newFeedback = await FeedbackModel.create({
        FeedbackId: lastFeedback !== null && lastFeedback.length > 0 ? lastFeedback[0].FeedbackId + 1 : 1,
        CustomerId: customerId,
        FeedbackName: feedbackName,
        FeedbackDescription: feedbackDescription,
        Grade: grade
    });
    return responseSuccess(res, 200, "Feedback created successfully", newFeedback);
}

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
    const { page, pageSize } = req.value.query;
    const feedbacQuery = FeedbackModel.aggregate([
        {
            $sort: {
                FeedbackId: -1
            }
        },
        {
            $project: {
                FeedbackId: 1,
                CustomerId: 1,
                FeedbackName: 1,
                FeedbackDescription: 1,
                Grade: 1,
                createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: TIME_ZONE } },
                updatedAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$updatedAt", timezone: TIME_ZONE } }
            },
        }
    ])

    const feedbacks = await FeedbackModel.aggregatePaginate(feedbacQuery, pageConfig(page, pageSize));
    return responseSuccess(res, 200, "Feedbacks fetched successfully", feedbacks);
}
module.exports = {
    newFeedBack,
    getAllFeedbacks
};