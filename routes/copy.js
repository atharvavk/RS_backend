const express = require("express");
const fat = require("../models/FAT");
const router = express.Router();
const sha256 = require("crypto-js/sha256");
const gfStream = require("gridfs-stream");
const mongoose = require("mongoose");
const conn = mongoose.createConnection(process.env.DB_URL);
var gfs;
const { response } = require("express");
conn.once("open", () => {
  gfs = gfStream(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

router.post("/", async (req, res) => {
  var source = await req.body.source;
  var destination = await req.body.destination;
  var ls = await fat.find({ username: req.session.username });
  var fileOrDirName = source.slice(source.lastIndexOf("/"), source.length);
  var isErr = false;
  for (var item of ls) {
    if (item.path.indexOf(source) == 0) {
      try {
        var newName = item.path.slice(
          source.length - fileOrDirName.length,
          item.path.length
        );
        var newPost = new fat({
          path: destination + newName,
          username: item.username,
          isDirectory: item.isDirectory,
          shareable: false,
        });
        await newPost.save();
      } catch (err) {
        isErr = true;
        response.send({ message: "Error Occured" });
        return;
      }
      if (item.isDirectory === false && !isErr) {
        //actual file copying
        var newFilename =
          (await req.session.username) + "/" + destination + newName;
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
        try {
          var ws = await gfs.createWriteStream({
            filename: newFilenameEncoded,
          });

          var rs = gfs.createReadStream({ filename: oldFilenameEncoded });
          await ws.on("open", () => {
            rs.pipe(ws);
          });
        } catch (err) {
          response.send({ message: "Error Occured" });
          return;
        }
        // await rs.pipe(ws);
      }
    }
  }
  res.send({ message: "Execution successfully compvared" });
});

module.exports = router;
