const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: String,
        required: true
    },
    description: String,
    image: String,
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
