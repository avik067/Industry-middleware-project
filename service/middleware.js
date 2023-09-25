var user = {};

// var AdminController = require('../Controller/Auth/Admin');
var UserController = require('../Controllers/Auth/Seller');
const responceCode = require('../service/responce');

//Middleware
const parmisoen = [
    {
        url: "/seller/register",
    },
    {
        url: "/seller/login",
    },


]

user.middleware = async (req, res, next) => {
    if (parmisoen.filter(it => it.url == req.url).length > 0) {
        next();
    } else {
        if (!req.headers.authorization) {
            return res.status(responceCode.errorCode.requiredError).json({ error: "No credentials sent!", status: false, credentials: false });
        } else {
            let authorization = req.headers.authorization
            let userData = null;
            let userType = typeof (req.headers.usertype) != "undefined" ? req.headers.usertype : "Seller";
            // console.log('userType', userType, authorization);
            if (userType == "Admin") {
                userData = await AdminController.getTokenData(authorization);
            } else if (userType == "Seller") {
                // console.log("dd")
                userData = await UserController.getTokenData(authorization);
            }

            if (userData && userData != null) {
                userData.password = null;
                userData.token = null;
                req.user = userData;
                req.userType = userType;
                req.token = req.headers.authorization,
                    next();
            } else {
                res.status(responceCode.errorCode.authError).json({ error: "credentials not match", status: false, credentials: false });
            }

        }
    }

}



module.exports = user;