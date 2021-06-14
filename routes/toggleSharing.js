const express = require("express");
const fat = require("../models/FAT");
const router = express.Router();

router.post("/", async (req, res) => {
  let path = await req.body.path;
  let doc = await fat.findOne({
    path: path,
    username: await req.session.username,
  });
  if (doc.shareable == false) {
    await fat.updateOne(
      { path: path, username: await req.session.username },
      { $set: { shareable: true } }
    );
    res.send({
      message:
        "use link http://localhost:4200/api/download?path=" +
        path +
        "&owner=" +
        (await req.session.username) +
        " to share file",
    });
  } else {
    await fat.updateOne(
      { path: path, username: await req.session.username },
      { $set: { shareable: false } }
    );
    res.send({ message: "sharing status: off" });
  }
});

module.exports = router;
