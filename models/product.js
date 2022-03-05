const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: String,
        description: String,
        price: Number,
        url: String,
    },
    {
        strict: true,
    }
);

module.exports = mongoose.model('Product', ProductSchema);
