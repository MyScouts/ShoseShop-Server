const { responseSuccess } = require("../common/app");
const AccountModel = require("../models/account");
const AccountInfo = require("../models/accountInfo");
const { convertStringToHash, encodedToken } = require("../utils/string");

const managerCreate = async (req, res) => {
    const { userName, password } = req.value.body;

    const findAccount = await AccountModel.findOne({ UserName: `${userName}`.toLowerCase() });
    if (findAccount) return responseSuccess(res, 301, "UserName is existed");

    const accounts = await AccountModel.find().sort({ AccountId: -1 }).limit(1);
    const newAccount = await AccountModel.create({
        AccountId: accounts && accounts.length > 0 ? accounts[0].AccountId + 1 : 1,
        UserName: userName,
        Password: await convertStringToHash(password),
        RoleId: 1
    })
    return responseSuccess(res, 200, "Create account success", newAccount);
}


const managerLogin = async (req, res) => {
    const { userName, password } = req.value.body;

    const findAccount = await AccountModel.findOne({ UserName: `${userName}`.toLowerCase() });
    if (findAccount.RoleId !== 1) return responseSuccess(res, 301, "Account is not manager");

    const isMatch = await findAccount.comparePassword(password);
    if (!isMatch) return responseSuccess(res, 302, "Password is not match");

    const token = await encodedToken(findAccount.AccountId);
    return responseSuccess(res, 200, "Login successfully!", { token, account: findAccount });

}

const registerCustomer = async (req, res) => {
    const { userName, password, passwordConfirm, fullName, sex, email, phoneNumber, address } = req.value.body;

    const findAccount = await AccountModel.findOne({ UserName: `${userName}`.toLowerCase() });
    if (findAccount) return responseSuccess(res, 301, "UserName is existed");

    // compare password
    if (password !== passwordConfirm) return responseSuccess(res, 302, "Password is not match");

    const accounts = await AccountModel.find().sort({ AccountId: -1 }).limit(1);
    const mewAccount = await AccountModel.create({
        AccountId: accounts && accounts.length > 0 ? accounts[0].AccountId + 1 : 1,
        UserName: userName,
        Password: await convertStringToHash(password),
        RoleId: 2
    })
    await AccountInfo.create({
        AccountId: mewAccount.AccountId,
        FullName: fullName,
        Sex: sex,
        Email: email,
        PhoneNumber: phoneNumber,
        Address: address
    })

    return responseSuccess(res, 200, "Create Customer is successfully!")
}

const customerLogin = async (req, res) => {
    const { userName, password } = req.value.body;

    const findAccount = await AccountModel.findOne({ UserName: `${userName}`.toLowerCase() });
    console.log("🚀 ~ file: authController.js ~ line 28 ~ managerLogin ~ findAccount", findAccount)

    if (findAccount.RoleId !== 2) return responseSuccess(res, 302, "Account is not customer");

    const isMatch = await findAccount.comparePassword(password);
    if (!isMatch) return responseSuccess(res, 302, "Password is not match");

    const token = await encodedToken(findAccount.AccountId);
    return responseSuccess(res, 200, "Login successfully!", { token, account: findAccount });
}

const updatePassword = async (req, res) => {
    const { password, passwordConfirm, newPassword } = req.value.body;
    const { accountId } = req.user.AccountId;

    if (newPassword !== passwordConfirm) return responseSuccess(res, 301, "new password and password Confirm is not match");

    const account = await AccountModel.findOne({ AccountId: accountId });

    if (!account) return responseSuccess(res, 302, "Account is not existed");

    const isMatch = await account.comparePassword(password);
    if (!isMatch) return responseSuccess(res, 303, "Password is not match");

    account.Password = await convertStringToHash(newPassword);
    await account.save();
    return responseSuccess(res, 200, "Update password successfully!")
}


module.exports = {
    managerCreate,
    registerCustomer,
    managerLogin,
    customerLogin,
    updatePassword
}