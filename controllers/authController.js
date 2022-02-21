const { responseSuccess } = require("../common/app");
const AccountModel = require("../models/account");

const managerCreate = async (req, res) => {
    const { userName, password } = req.value.body;

    const newAccount = new AccountModel.create({
        UserName: userName,
        Password: password,
        RoleId: 1
    })

    return responseSuccess(res, 200, "Create account success", newAccount);
}

module.exports = {
    managerCreate
}