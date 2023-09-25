const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    sellerId: mongoose.Schema.Types.ObjectId,
    categoryId: mongoose.Schema.Types.ObjectId,
    subcategoryId: mongoose.Schema.Types.ObjectId,
    brandId: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    convertedUnit: {
        type: Number,
        required: false
    },
    minqty: {
        type: Number,
    },
    productDesc: {
        type: String,
    },
    productImg: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
    },
    updatedOn: {
        type: Date,
    },

})

module.exports = mongoose.model('Product', ProductSchema);