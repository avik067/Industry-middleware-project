const mongoose = require('mongoose');

const PettyCashSchema = new mongoose.Schema({
    sellerId: mongoose.Schema.Types.ObjectId,
    amount: {
        type: number,
        required: true,
    },
    expense: {
        type: String,
    },
    type: {
        type: String,
        required: true,
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

module.exports = mongoose.model('PettyCash', PettyCashSchema);