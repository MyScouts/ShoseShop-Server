require("dotenv").config()
const MONGOOSE_URI = process.env.MONGOOSE_URI
const mongooseClient = require('mongoose');
const categorySeed = require("./category")
const productSeed = require("./product")
const attributeSeed = require("./attribute")
const roleSeed = require("./roles")
    // MAIN SEED FUNCTION
async function seedDB() {
    // console.log(
    await mongooseClient.connect(MONGOOSE_URI, {
            useNewUrlParser: true,
        })
        // )
    try {
        let i = 0
        i++
        console.log("seed index.js loop " + i + " times");
        await categorySeed()
        await productSeed()
        await attributeSeed()
        await roleSeed()
    } catch (err) {
        console.log(err.stack);
        console.log("%c index seed catched error!", "background: #222; color: blue;");
    }
    try {
        await roleSeed()
    } catch (err) {
        console.log(err.stack);
        console.log("%c index seed catched error!", "background: #222; color: blue;");
    }
}

seedDB()