const router = require("express").Router();
const users = [];

router.post("/register", (req, res) => {
  const user = { name: req.body.name, password: req.body.password };
  users.push(user);
  res.status(201).send();
});

module.exports = router;
