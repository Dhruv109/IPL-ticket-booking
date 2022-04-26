const router = require("express").Router();
const db = require("../db");

router.get("/usertable", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
