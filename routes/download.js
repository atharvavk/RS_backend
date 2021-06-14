const express = require("express");
const sha256 = require("crypto-js/sha256");
require("dotenv/config");
const gfStream = require("gridfs-stream");
const fat = require("../models/FAT");
const mongoose = require("mongoose");
const conn = mongoose.createConnection(process.env.DB_URL);
let gfs;
conn.once("open", () => {
  gfs = gfStream(conn.db, mongoose.mongo);
  gfs.collection("fs");
});
const router = express.Router();

router.get("/", async (req, res) => {
  let path = req.query.owner + "/" + req.query.path;
  let name, extension;
  name = path.slice(0, path.lastIndexOf("."));
  extension = path.slice(path.lastIndexOf("."), path.length);
  let hasAccess = true;
  let doc;
  if (req.query.owner != (await req.session.username)) {
    doc = await fat.findOne({
      path: await req.query.path,
      username: await req.query.owner,
    });
    if (doc == null) {
      hasAccess = false;
    } else {
      if (doc.shareable == false) {
        hasAccess = false;
      }
    }
  }
  if (hasAccess) {
    let hash = sha256(name).toString() + extension;
    try {
      var readStream = gfs.createReadStream({ filename: hash });
    } catch (err) {
      res.sendStatusStatus(404);
    }
    readStream.pipe(res);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
