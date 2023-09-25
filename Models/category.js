const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    sellerId: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    image: {
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

module.exports = mongoose.model('Category', CategorySchema);