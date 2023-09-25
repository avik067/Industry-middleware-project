const mongoose = require('mongoose');
var Seller = require('../../Models/seller');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const { DBerror, InputError } = require('../../service/errorHandeler');
var ResponceCode = require('../../service/responce');

function createToken(data) {
    return jwt.sign(data, 'inventoryManagement');
}

const getTokenData = async (token) => {
    let seller = await Seller.findOne({
        token: token
    }).exec();
    return seller;
}

const register = async (req, res) => {
    const v = new Validator(req.body, {
        name: 'required',
        phoneNo: 'required',
        password: 'required|minLength:6',
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(ResponceCode.errorCode.requiredError).send({ status: false, error: v.errors, message: InputError(v.errors) });
    }

    sellerData = {
        ...req.body,
        password: passwordHash.generate(req.body.password),
        token: createToken(req.body),
        createdOn: new Date(),
        updatedOn: new Date(),
    }

    new Seller(sellerData).save()
        .then((data) => {
            var resData = {
                token: data.token
            }
            res.status(ResponceCode.errorCode.success).json({
                status: true,
                message: "Seller register successfully",
                data: resData
            })
        }).catch((error) => {
            const errors = DBerror(error)
            res.status(ResponceCode.errorCode.serverError).json({
                status: false,
                message: errors,
                error: error
            })
        })
}

const login = async (req, res) => {
    const v = new Validator(req.body, {
        phoneNo: 'required',
        password: 'required|minLength:6'
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(ResponceCode.errorCode.requiredError).send({ status: false, error: v.errors, message: InputError(v.errors) });
    }

    Seller.findOne({
        phoneNo: req.body.phoneNo,
    }).then((data) => {
        if (data != "" && data.comparePassword(req.body.password)) {
            var sellerData = {
                token: data.token
            }
            res.status(ResponceCode.errorCode.success).json({
                status: true,
                message: "Login successfully",
                data: sellerData
            })
        } else {
            res.status(ResponceCode.errorCode.dataNotmatch).json({
                status: false,
                message: "Password not match"
            })
        }
    }).catch((error) => {
        res.status(ResponceCode.errorCode.dataNotmatch).json({
            status: false,
            message: "Seller details not found. Please try again",
            error: error
        })
    })
}
const profileFetch= (req, res) => {
    Seller.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $project: {
                name: 1,
                phoneNo: 1,
                email: 1,
                address: 1
            }
        }
    ]).then((data) => {
        res.status(ResponceCode.errorCode.success).json({
            status: true,
            message: "Profile get successfully.",
            data: data
        })
    }).catch((error) => {
        res.status(ResponceCode.errorCode.serverError).json({
            status: true,
            message: "Server error. Please try again .",
            data: data
        })
    });
}
module.exports = {
    getTokenData,
    register,
    login,
    profileFetch
}