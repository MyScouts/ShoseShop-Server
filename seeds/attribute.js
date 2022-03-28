const faker = require('faker')
const AttributeModel = require('../models/attribute')

// Seed attributes
const attributeSeed = async() => {
    try {
        // for (i = 0; i < 100; i++) {
        //     await new AttributeModel({
        //         AttributeId: i + 1,
        //         AttributeName: faker.commerce.department(),
        //         AttributeDescription: faker.lorem.paragraph(),
        //         AttributeImage: faker.image.image(),
        //         ProductId: Math.floor(Math.random() * 50)
        //     }).save()
        // }
    } catch (error) {
        console.log("%c attributeSeed seed catched error!", "background: #222; color: blue;");
        return
    }
}

// Export module
module.exports = attributeSeed