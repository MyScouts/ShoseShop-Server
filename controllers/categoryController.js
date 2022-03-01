const { responseSuccess } = require("../common/app");
const CategoryModel = require("../models/category");

const getAllIds = async (req, res) => {
    const categories = await CategoryModel.find({}, { _id: 0, CategoryId: 1, CategoryName: 1, CategoryDescription: 1 }).sort({ CategoryName: 1 });
    return responseSuccess(res, 200, "Get all categories successfully", categories);
}

module.exports = {
    getAllIds
}