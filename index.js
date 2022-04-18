const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const app = express();
const port = 3000;

const users = [];
//const registerLogin = require('./routes/registerlogin')
app.set("view-engine", "ejs");
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { error: null });
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    //return res.status(401).send();
  } else res.render("dashboard.ejs", { error: null });
});

//registering  a user
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(user);
    console.log("registered");
    res.redirect("/login");
  } catch (err) {
    res.status(500).send(err);
  }
});

//logging in user
app.post("/login", async (req, res) => {
  const user = users.find((user) => user.email == req.body.email);
  if (user == null) {
    req.flash("error", "Incorrect email or password");
    res.redirect("/login");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user;
      res.redirect("/dashboard");
    } else {
      req.flash("error", "Incorrect email or password");
      res.redirect("/login");
    }
  } catch {
    res.status(500).send();
  }
});

//using routes
//app.use('/')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
