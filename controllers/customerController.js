const { responseSuccess } = require("../common/app");
const AccountInfo = require("../models/accountInfo");

const customerInfo = async (req, res) => {
    const accountId = req.user.AccountId;
    const accountInfo = await AccountInfo.findOne({ AccountId: parseInt(accountId) });
    return responseSuccess(res, 200, "Get account info successfully!", accountInfo);
}

const updateCustomerInfo = async (req, res) => {
    const accountId = req.user.AccountId;
    const { fullName, sex, email, phoneNumber, address } = req.value.body;

    const customer = await AccountInfo.findOne({ AccountId: accountId })

    if (!customer) return responseSuccess(res, 301, "User not found!");

    customer.FullName = fullName;
    customer.Sex = sex
    customer.Email = email
    customer.PhoneNumber = phoneNumber
    customer.Address = address
    await customer.save()

    return responseSuccess(res, 200, "Update profile is successfully!", customer)

}

module.exports = {
    customerInfo,
    updateCustomerInfo
}