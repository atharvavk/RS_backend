const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fat = require("../models/FAT");
const conn = mongoose.createConnection(process.env.DB_URL);
const sha256 = require("crypto-js/sha256");
const gfStream = require("gridfs-stream");
var gfs;
conn.once("open", () => {
  gfs = gfStream(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

router.post("/", async (req, res) => {
  try {
    let path = await req.body.path;
    let ls = await fat.find({ username: await req.session.username });
    for (let item of ls) {
      if (item.path.indexOf(path) === 0) {
        await fat.deleteOne({
          path: item.path,
          username: await req.session.username,
        });
        if (item.isDirectory === false) {
          let filename = req.session.username + "/" + item.path;
          let filenameEncoded =
            sha256(filename.slice(0, filename.lastIndexOf("."))).toString() +
            filename.slice(filename.lastIndexOf("."), filename.length);
          await gfs.files.deleteOne({ filename: filenameEncoded });
        }
      }
    }
    res.send({ message: "operation successful" });
  } catch (err) {
    res.send({ message: "error occured" });
  }
});

module.exports = router;
