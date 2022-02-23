const bcrypt = require('bcryptjs')
const { PASSPORT_SECRET } = require('../common/app')
const JWT = require('jsonwebtoken')
const { addDateWithNow } = require('./dateTime')



const convertStringToHash = async (str) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(str, salt)
}

const encodedToken = async (userID) => {
    return JWT.sign({
        iss: "TRAN HOANG HUY",
        sub: userID,
        iat: new Date().getTime(),
        exp: addDateWithNow(6)
    }, PASSPORT_SECRET)
}

module.exports = {
    convertStringToHash,
    encodedToken
}