const RoleModel = require("../models/role")

const rolesSeed = async () => {

    await new RoleModel({
        RoleName: "manager",
        RoleId: 1
    }).save()

    await new RoleModel({
        RoleName: "customer",
        RoleId: 2
    }).save()
}

// Export module
module.exports = rolesSeed