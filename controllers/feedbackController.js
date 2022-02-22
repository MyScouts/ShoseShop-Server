const { responseSuccess } = require("../common/app");
const FeedbackModel = require("../models/feedback");


// Create a new feedback
const newFeedBack = async (req, res) => {
    const customerId = req.user.AccountId;
    const { feedbackName, feedbackDescription, grade } = req.value.body;

    const newFeedback = await FeedbackModel.create({
        CustomerId: customerId,
        FeedbackName: feedbackName,
        FeedbackDescription: feedbackDescription,
        Grade: grade
    });
    return responseSuccess(res, 200, "Feedback created successfully", newFeedback);
}

module.exports = {
    newFeedBack
};