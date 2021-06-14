const express = require("express");
const router = express.Router();
const multer = require("multer");
const fat = require("../models/FAT");
let storage = require("../models/Storage");
router.use(express.urlencoded());

const upload = multer({ storage: storage });

router.post("/", upload.single("uploadedFile"), (req, res) => {
  let newPost = new fat({
    path: req.body.pwd + "/" + req.file.originalname,
    username: req.session.username,
    shareable: false,
    isDirectory: false,
  });
  newPost.save();
  res.send({ message: "request completed" });
});

module.exports = router;
