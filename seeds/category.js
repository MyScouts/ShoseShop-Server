const CategoryModel = require('../models/category')
const faker = require('faker')
// Seed categories
const categorySeed = async () => {
    for (i = 0; i < 20; i++) {

        const maxCategory = await CategoryModel.find({}).sort({ CategoryId: -1 }).limit(1)
        // 
        new CategoryModel({
            CategoryId: maxCategory !== null && maxCategory.length > 0 ? maxCategory[0].CategoryId + 1 : 1,
            CategoryName: faker.commerce.department(),
            CategoryDescription: faker.lorem.paragraph()
        }).save()
    }
}

// Export module
module.exports = categorySeed