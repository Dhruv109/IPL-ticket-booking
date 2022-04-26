const router = require("express").Router();
const bcrypt = require("bcrypt");
const connection = require("../db");

router.get("/users", (req, res) => {
  res.json(users);
});

router.get("/register", (req, res) => {
  res.render("register.ejs", { error: null });
});
router.get("/login", (req, res) => {
  res.render("login.ejs");
});
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    res.redirect("./login");
    //return res.status(401).send();
  } else {
    console.log(req.session.user);
    const sql = "SELECT * FROM MATCHES";
    connection
      .promise()
      .query(sql)
      .then((matches) => {
        //console.log(matches);
        res.render("dashboard.ejs", {
          user: req.session.user,
          matches: matches[0],
        });
      });
  }
});

//registering  a user
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const sql = `INSERT INTO users VALUES('${req.body.email}', '${hashedPassword}', '${req.body.name}', 0)`;
    connection.query(sql, (err, result) => {
      if (err) {
        req.flash("error", "User already exists");
        res.redirect("./register");
      } else {
        console.log("User registered");
        res.redirect("./login");
      }
    });
  } catch (err) {
    res.status(500).send();
  }
});

//logging in user
router.post("/login", async (req, res) => {
  //const user = users.find((user) => user.email == req.body.email);

  const sql = `SELECT * FROM users WHERE email = '${req.body.email}'`;
  connection.query(sql, async (err, result) => {
    if (err || result.length == 0) {
      req.flash("error", "Incorrect email or password");
      res.redirect("./login");
    }
    try {
      if (await bcrypt.compare(req.body.password, result[0].password)) {
        req.session.user = result[0];
        res.redirect("./dashboard");
      } else {
        req.flash("error", "Incorrect email or password");
        res.redirect("./login");
      }
    } catch {
      res.status(500).send();
    }
  });
});

module.exports = router;
