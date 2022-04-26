const router = require("express").Router();
const db = require("../db");

router.get("/usertable", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/filtermatches", (req, res) => {
  let sql;

  if (req.body.team && req.body.city && req.body.date) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE (TEAM_1 = '${req.body.team}' OR TEAM_2 = '${req.body.team}') AND MATCH_DATE = '${req.body.date}' AND STADIUM_NAME = '${req.body.city}' `;
  } else if (req.body.team && req.body.city) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE (TEAM_1 = '${req.body.team}' OR TEAM_2 = '${req.body.team}') AND STADIUM_NAME = '${req.body.city}' `;
  } else if (req.body.city && req.body.date) {
    sql = `SELECT * FROM MATCHES  NATURAL JOIN STADIUMS WHERE MATCH_DATE = '${req.body.date}' AND STADIUM_NAME = '${req.body.city}' `;
  } else if (req.body.team && req.body.date) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE (TEAM_1 = '${req.body.team}' OR TEAM_2 = '${req.body.team}') AND MATCH_DATE = '${req.body.date}' `;
  } else if (req.body.team) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE (TEAM_1 = '${req.body.team}' OR TEAM_2 = '${req.body.team}') `;
  } else if (req.body.city) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE STADIUM_NAME = '${req.body.city}' `;
  } else if (req.body.date) {
    sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE MATCH_DATE = '${req.body.date}' `;
  } else sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS `;

  db.promise()
    .query(sql)
    .then((matches) => {
      res.render("dashboard.ejs", {
        user: req.session.user,
        matches: matches[0],
      });
    });
});
module.exports = router;
