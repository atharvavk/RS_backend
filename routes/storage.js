require("dotenv/config");
const express = require("express");
const router = express.Router();
router.use(express.urlencoded());
const fat = require("../models/FAT");

router.post("/", async (req, res) => {
  let username = await req.session.username;
  var _files = [];
  var _dirs = [];
  let ls = await fat.find({
    username: username,
  });
  for (let item of ls) {
    if (item.path.indexOf(req.body.pwd + "/") === 0) {
      var truncated = item.path.slice(req.body.pwd.length + 1, item.length);
      if (truncated.indexOf("/") === -1) {
        if (item.isDirectory === false) {
          _files.push(truncated);
        } else {
          _dirs.push(truncated);
        }
      }
    }
  }
  var responseObject = {
    success: true,
    files: _files,
    dirs: _dirs,
  };
  res.send(responseObject);
});

module.exports = router;
