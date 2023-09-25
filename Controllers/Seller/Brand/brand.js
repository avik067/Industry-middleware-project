const mongoose = require('mongoose');
const { Validator } = require('node-input-validator');
const { DBerror, InputError } = require('../../../service/errorHandeler');
var ResponceCode = require('../../../service/responce');
var Brand = require('../../../Models/brand');

const brandCreate = async (req, res) => {

    const v = new Validator(req.body, {
        name: 'required|string',
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(ResponceCode.errorCode.requiredError).send({ status: false, error: v.errors, message: InputError(v.errors) });
    }

    var brandData = {
        ...req.body,
        sellerId: mongoose.Types.ObjectId(req.user._id),
        createdOn: new Date(),
        updatedOn: new Date()
    }
    Brand.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                name: req.body.name,
                isDeleted: false
            }
        }
    ])
        .then((data) => {
            if (data.length == 1) {
                res.status(ResponceCode.errorCode.dataExist).json({
                    sttaus: false,
                    message: "Brand exist. Please try another category.",
                })
            } else {
                new Brand(brandData).save()
                    .then((catData) => {
                        res.status(ResponceCode.errorCode.success).json({
                            sttaus: true,
                            message: "Brand added successfully"
                        })
                    }).catch((error) => {
                        let errors = DBerror(error);
                        res.status(ResponceCode.errorCode.serverError).json({
                            sttaus: false,
                            message: errors,
                            error: "Server error. Please try again"
                        })
                    })
            }
        }).catch((error) => {
            let errors = DBerror(error);
            res.status(ResponceCode.errorCode.serverError).json({
                sttaus: false,
                message: errors,
                error: "Server error. Please try again"
            })
        })
}

const brandGet = (req, res) => {
    Brand.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                status: true,
                isDeleted: false
            }
        },
        {
            $project: {
                name: 1,
                image: 1
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ])
        .then((data) => {
            res.status(ResponceCode.errorCode.success).json({
                sttaus: true,
                message: "Brand Get successfully",
                data: data
            })

        }).catch((error) => {
            let errors = DBerror(error);
            res.status(ResponceCode.errorCode.serverError).json({
                sttaus: false,
                message: errors,
                error: "Server error. Please try again"
            })
        })
}

const brandEdit = (req, res) => {
    Brand.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                name: req.body.name,
                isDeleted: false
            }
        },
    ])
        .then((data) => {
            if (data.length == 1) {
                res.status(ResponceCode.errorCode.dataExist).json({
                    sttaus: false,
                    message: "Brand exist. Please try another category.",
                })
            } else {
                Brand.findOneAndUpdate(
                    {
                        _id: {
                            $in: [mongoose.Types.ObjectId(req.params.brandId)]
                        }
                    },
                    {
                        ...req.body,
                        updatedOn: new Date()
                    }
                ).then((catData) => {
                    res.status(ResponceCode.errorCode.success).json({
                        sttaus: true,
                        message: "Brand update successfully",
                    })
                }).catch((error) => {
                    let errors = DBerror(error);
                    res.status(ResponceCode.errorCode.serverError).json({
                        sttaus: false,
                        message: errors,
                        error: "Server error. Please try again"
                    })
                })
            }
        }).catch((error) => {
            let errors = DBerror(error);
            res.status(ResponceCode.errorCode.serverError).json({
                sttaus: false,
                message: errors,
                error: "Server error. Please try again"
            })
        })
}

const brandDelete = (req, res) => {
    Brand.findOneAndUpdate(
        {
            _id: {
                $in: [mongoose.Types.ObjectId(req.params.brandId)]
            }
        },
        {
            isDeleted: true
        }
    )
        .then((data) => {
            res.status(ResponceCode.errorCode.success).json({
                sttaus: true,
                message: "Brand deleted successfully",
            })

        }).catch((error) => {
            let errors = DBerror(error);
            res.status(ResponceCode.errorCode.serverError).json({
                sttaus: false,
                message: errors,
                error: "Server error. Please try again"
            })
        })
}

module.exports = {
    brandCreate,
    brandGet,
    brandEdit,
    brandDelete
}