const express = require("express");
const router = express.Router();
const fat = require("../models/FAT");

router.post("/", async (req, res) => {
  try {
    let newPost = new fat({
      path: (await req.body.pwd) + "/" + (await req.body.dirName),
      username: req.session.username,
      shareable: false,
      isDirectory: true,
    });
    await newPost.save();
    res.send({ message: "request executed successfully", success: true });
  } catch (err) {
    res.send({ message: "error occured", success: false });
  }
});

module.exports = router;
