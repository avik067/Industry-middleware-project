const mongoose = require('mongoose');
const { Validator } = require('node-input-validator');
const { DBerror, InputError } = require('../../../service/errorHandeler');
var ResponceCode = require('../../../service/responce');
var SubCategory = require('../../../Models/subCategory');

const subcategoryCreate = async (req, res) => {

    const v = new Validator(req.body, {
        name: 'required|string',
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(ResponceCode.errorCode.requiredError).send({ status: false, error: v.errors, message: InputError(v.errors) });
    }

    var subcategoryData = {
        ...req.body,
        sellerId: mongoose.Types.ObjectId(req.user._id),
        createdOn: new Date(),
        updatedOn: new Date()
    }

    SubCategory.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                name: req.body.name,
                isDeleted: false
            }
        }
    ])
        .then((data) => {
            if (data.length == 1) {
                res.status(ResponceCode.errorCode.dataExist).json({
                    sttaus: false,
                    message: "Subcategory exist. Please try another Subcategory."
                })
            } else {
                new SubCategory(subcategoryData).save()
                    .then((subData) => {
                        res.status(ResponceCode.errorCode.success).json({
                            sttaus: true,
                            message: "Subcategory added successfully"
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

const subcategoryGet = (req, res) => {
    SubCategory.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                status: true,
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "catdata",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$catdata", preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                name: 1,
                catdata: 1
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
                message: "Subcategory Get successfully",
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

const subcategoryEdit = (req, res) => {
    // console.log(req.params.subcatId);
    SubCategory.aggregate([
        {
            $match: {
                sellerId: mongoose.Types.ObjectId(req.user._id),
                categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                name: req.body.name,
                isDeleted: false
            }
        },
    ])
        .then((data) => {
            if (data.length == 1) {
                res.status(ResponceCode.errorCode.dataExist).json({
                    sttaus: false,
                    message: "Subcategory exist. Please try another Subcategory."
                })
            } else {
                SubCategory.findOneAndUpdate(
                    {
                        _id: {
                            $in: [mongoose.Types.ObjectId(req.params.subcatId)]
                        }
                    },
                    {
                        ...req.body,
                        updatedOn: new Date()
                    }
                ).then((subcatData) => {
                    res.status(ResponceCode.errorCode.success).json({
                        sttaus: true,
                        message: "Subcategory update successfully",
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

const subcategoryDelete = (req, res) => {
    SubCategory.findOneAndUpdate(
        {
            _id: {
                $in: [mongoose.Types.ObjectId(req.params.subcatId)]
            }
        },
        {
            isDeleted: true
        }
    )
        .then((data) => {
            res.status(ResponceCode.errorCode.success).json({
                sttaus: true,
                message: "Subcategory deleted successfully",
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
    subcategoryCreate,
    subcategoryGet,
    subcategoryEdit,
    subcategoryDelete
}