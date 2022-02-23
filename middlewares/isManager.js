const isManager = (req, res, next) => {
    if (req.user && req.user.RoleId == 1) {
        next()
    } else {
        res.status(401).send({
            message: "You are not authorized to access this resource"
        })
    }
}

module.exports = isManager