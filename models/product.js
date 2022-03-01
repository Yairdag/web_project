const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  price: String,
  id: String,
  url: String
},
{
  strict: true
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("Product", ProductSchema);
