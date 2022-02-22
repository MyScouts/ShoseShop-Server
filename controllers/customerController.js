const { responseSuccess } = require("../common/app");
const AccountInfo = require("../models/accountInfo");

const customerInfo = async (req, res) => {
    const accountId = req.user.AccountId;
    const accountInfo = await AccountInfo.findOne({ AccountId: parseInt(accountId) });
    return responseSuccess(res, 200, "Get account info successfully!", accountInfo);
}

module.exports = {
    customerInfo
}