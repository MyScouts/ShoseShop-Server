
require("dotenv").config()
const MONGOOSE_URI = process.env.MONGOOSE_URI
const mongooseClient = require('mongoose');
const categorySeed = require("./category")
const productSeed = require("./product")
const attributeSeed = require("./attribute")
const roleSeed = require("./roles")
// MAIN SEED FUNCTION
async function seedDB() {
    await mongooseClient.connect(MONGOOSE_URI, {
        useNewUrlParser: true,
    })
    try {
        await categorySeed()
        await productSeed()
        await attributeSeed()
        await roleSeed()
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB()