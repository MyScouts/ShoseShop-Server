
require("dotenv").config()
const MONGOOSE_URI = process.env.MONGOOSE_URI
const mongooseClient = require('mongoose');
const categorySeed = require("./category")
const productSeed = require("./product")
const attributeSeed = require("./attribute")

// MAIN SEED FUNCTION
async function seedDB() {
    await mongooseClient.connect(MONGOOSE_URI, {
        useNewUrlParser: true,
    })
    try {
        await categorySeed()
        // await productSeed()
        await attributeSeed()
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB()