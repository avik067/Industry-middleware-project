const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    sellerId: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    address: {
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

module.exports = mongoose.model('Seller', SupplierSchema);