const express = require('express');
const Users = require('../models/Users');
const fs = require('fs');
const router = express.Router();
const fat = require('../models/FAT');
require('dotenv/config');

router.post('/', async (req, res) => {
  console.log('request received');
  let newPost = new Users({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
  });
  try {
    await newPost.save();
    res.send({
      success: true,
      message: 'successfully registerred',
    });
    let newEntry = new fat({
      address: {
        path: '.',
        user: req.body.username,
      },
      isDirectory: true,
      shareable: false,
      file_id: '0',
    });
    await newEntry.save();
  } catch (err) {
    let msg;
    if (err.keyValue.email != undefined) {
      msg = 'E-mail ' + err.keyValue.email + ' already registerred';
    } else if (err.keyValue.username != undefined) {
      msg = 'Username ' + err.keyValue.username + ' alredy registerred';
    } else {
      msg = 'Unknown error occured';
    }
    res.send({
      success: false,
      message: msg,
    });
  }
});

module.exports = router;
