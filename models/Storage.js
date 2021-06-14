const GridFsStorage = require("multer-gridfs-storage");
const sha256 = require("crypto-js/sha256");
require("dotenv/config");

let storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    return new Promise(async (resolve, reject) => {
      let name, fname, extension;
      fname =
        req.session.username + "/" + req.body.pwd + "/" + file.originalname;
      name = fname.slice(0, fname.lastIndexOf("."));
      extension = fname.slice(fname.lastIndexOf("."), fname.length);
      const filename = sha256(name).toString() + extension;
      const fileInfo = {
        filename: filename,
        bucketName: "fs",
      };
      resolve(fileInfo);
    });
  },
});

module.exports = storage;
