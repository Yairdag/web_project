const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema);
