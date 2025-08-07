const mongoose = require("mongoose");

const mainAdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  securityKey: String,
});

// 👉 Force Mongoose to use 'mainadmins' collection
module.exports = mongoose.model("MainAdmin", mainAdminSchema, "mainadmins");
