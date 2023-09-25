const mongoose = require('mongoose');
var passwordHash = require('password-hash');

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
    },
    token: {
        type: String,
    },
    pettyCash: {
        type: Number,
        default: 0
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

SellerSchema.methods.comparePassword = function (candidatePassword) {
    return passwordHash.verify(candidatePassword, this.password);
};

module.exports = mongoose.model('Seller', SellerSchema);