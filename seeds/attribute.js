const faker = require('faker')
const AttributeModel = require('../models/attribute')

// Seed attributes
const attributeSeed = async () => {
    for (i = 0; i < 20; i++) {
        new AttributeModel({
            AttributeId: i + 1,
            AttributeName: faker.commerce.department(),
            AttributeDescription: faker.lorem.paragraph(),
            AttributeImage: faker.image.image(),
            ProductId: Math.floor(Math.random() * 20)
        }).save()
    }
}

// Export module
module.exports = attributeSeed