const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String 
   
  },
  externalId: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("Users", userSchema);
