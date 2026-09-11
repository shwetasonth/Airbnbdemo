const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get users data");
});

router.get("/:id", (req, res) => {
  res.send("get users id ");
});

router.post("/", (req, res) => {
  res.send("post user data");
});

router.delete("/", (req, res) => {
  res.send("delete user data");
});

module.exports = router;
