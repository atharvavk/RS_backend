const express = require("express");
const Users = require("../models/Users");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let searchPost = await Users.findOne({ username: req.body.username });
    if (searchPost.password == req.body.password) {
      req.session.username = req.body.username;
      res.send({
        success: true,
        message: "Login Successful",
      });
    } else {
      res.send({
        success: false,
        message: "Invalid username or password",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "Invalid username or password",
    });
  }
});

router.get("/session", (req, res) => {
  if (req.session.username != undefined) {
    res.send({
      success: true,
      username: req.session.username,
    });
  } else {
    res.send({
      success: false,
    });
  }
});

module.exports = router;
