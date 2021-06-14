const express = require("express");
const fat = require("../models/FAT");
const router = express.Router();
const sha256 = require("crypto-js/sha256");
const gfStream = require("gridfs-stream");
const mongoose = require("mongoose");
const { request } = require("express");
const conn = mongoose.createConnection(process.env.DB_URL);
var gfs;
conn.once("open", () => {
  gfs = gfStream(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

router.post("/", async (req, res) => {
  var source = await req.body.source;
  var destination = await req.body.destination;
  var ls = await fat.find({ username: req.session.username });
  for (var item of ls) {
    var fileOrDirName = source.slice(source.lastIndexOf("/"), source.length);
    var isErr = false;
    if (item.path.indexOf(source) == 0) {
      try {
        var newName = item.path.slice(
          source.length - fileOrDirName.length,
          item.path.length
        );
        var newPath = destination + newName;
        await fat.updateOne({ _id: item._id }, { $set: { path: newPath } });
      } catch (err) {
        res.send({ message: "request failed" });
        return;
      }

      try {
        var newFilename = (await req.session.username) + "/" + newPath;
        //encodings of new filename
        var newFilenameEncoded =
          sha256(
            newFilename.slice(0, newFilename.lastIndexOf("."))
          ).toString() +
          newFilename.slice(newFilename.lastIndexOf("."), newFilename.length);
        var oldFilename = req.session.username + "/" + item.path;
        //encoding of old filename
        var oldFilenameEncoded =
          sha256(
            oldFilename.slice(0, oldFilename.lastIndexOf("."))
          ).toString() +
          oldFilename.slice(oldFilename.lastIndexOf("."), oldFilename.length);
        gfs.files.updateOne(
          { filename: oldFilenameEncoded },
          { $set: { filename: newFilenameEncoded } }
        );
      } catch (err) {
        res.send({ message: "request failed" });
        return;
      }
    }
  }
  res.send({ message: "request completed" });
});

module.exports = router;
