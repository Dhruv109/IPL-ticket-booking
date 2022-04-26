const db = require("mysql2");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}
//connecting to database
const connection = db.createConnection({
  host: "localhost", // host for connection
  user: "root", // username of the mysql connection
  password: process.env.DB_PASSWORD, // password of the mysql connection
  multipleStatements: true,
});
connection.connect((err) => {
  if (err) {
    console.log(err + "error occured while connecting");
  } else {
    console.log("connection created with Mysql successfully");
  }
});
const sql = "CREATE DATABASE IF NOT EXISTS ipl";
connection.query(sql, (err, res) => {
  if (err) throw err;
  console.log("DB created!");
});
//use ipldb
connection.query("USE ipl", (err, res) => {
  if (err) throw err;
  console.log("using IPL DB!");
});

module.exports = connection;
