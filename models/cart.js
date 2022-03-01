const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  total_price: String,
  items: {item:String, amount:Number}
},
{
  strict: true
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("Cart", CartSchema);
