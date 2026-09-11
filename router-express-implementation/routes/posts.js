const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get posts data");
});

router.get("/:id", (req, res) => {
  res.send("get posts id data");
});

module.exports = router;
