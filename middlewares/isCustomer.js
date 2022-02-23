const isCustomer = (req, res, next) => {
    if (req.user && req.user.RoleId == 2) {
        next()
    } else {
        res.status(401).send({
            message: "You are not authorized to access this resource"
        })
    }
}

module.exports = isCustomer