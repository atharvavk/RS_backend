const mongoose = require("mongoose");

const FAT = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: false,
  },
  isDirectory: {
    type: Boolean,
    default: false,
  },
  shareable: {
    type: Boolean,
    default: false,
  },
});

FAT.index({ path: 1, username: 1 }, { unique: true });

module.exports = mongoose.model("FAT", FAT);
