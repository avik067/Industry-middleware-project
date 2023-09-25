const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    sellerId: mongoose.Schema.Types.ObjectId,
    categoryId: mongoose.Schema.Types.ObjectId,
    name: {
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

module.exports = mongoose.model('subCategory', subCategorySchema);