const RoleModel = require("../models/role");

const rolesSeed = async () => {
  try {
    await new RoleModel({
      RoleName: "manager",
      RoleId: 1,
    }).save();

    await new RoleModel({
      RoleName: "customer",
      RoleId: 2,
    }).save();
  } catch {}
};

// Export module
module.exports = rolesSeed;
