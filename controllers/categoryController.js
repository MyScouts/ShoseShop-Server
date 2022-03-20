const { responseSuccess } = require("../common/app");
const CategoryModel = require("../models/category");

const getAllIds = async (req, res) => {
    const categories = await CategoryModel.find({}, { _id: 0, CategoryId: 1, CategoryName: 1, CategoryDescription: 1 }).sort({ CategoryName: 1 });
    return responseSuccess(res, 200, "Get all categories successfully", categories);
}

const newCategory = async (req, res) => {
    const { categoryName, categoryDescription } = req.body;
    const lastCategory = await CategoryModel.findOne({}, { _id: 0, CategoryId: 1 }).sort({ CategoryId: -1 });
    const newCategory = new CategoryModel({
        CategoryId: lastCategory ? lastCategory.CategoryId + 1 : 1,
        CategoryName: categoryName,
        CategoryDescription: categoryDescription
    });
    const category = await newCategory.save();
    return responseSuccess(res, 200, "Create new category successfully", category);
}

module.exports = {
    getAllIds,
    newCategory
}