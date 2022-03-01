const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  // cart: String
},
{
  strict: false
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
