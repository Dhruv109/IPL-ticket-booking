const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const app = express();
const db = require("./db");
const port = 3000;

//getting routes
const login = require("./routes/registerlogin");
const createTables = require("./routes/createTables");
const gettables = require("./routes/gettables");
const bookings = require("./routes/bookings");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

//const registerLogin = require('./routes/registerlogin')
app.set("view-engine", "ejs");
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//registering and loggin in route
app.use(express.static("public"));
app.use("/rl", login);
app.use("/user", gettables);
app.use("/new", createTables);
app.use("/user/booking", bookings);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
