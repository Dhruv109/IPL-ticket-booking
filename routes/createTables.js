//making the database
const connection = require("../db");
const router = require("express").Router();
router.get("/createtables", (req, res) => {
  connection.connect(function (err) {
    if (err) {
      console.log(err + "error occured while connecting");
    } else {
      //adding tables
      const userTable =
        "CREATE TABLE IF NOT EXISTS users (email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, NAME VARCHAR(30) NOT NULL, WALLET INT, PRIMARY KEY(email))";
      connection.query(userTable, (err, res) => {
        if (err) throw err;
        console.log("User Table created!");
      });
      const stadiumTable =
        "CREATE TABLE IF NOT EXISTS STADIUMS (STADIUM_ID INT NOT NULL AUTO_INCREMENT , STADIUM_NAME VARCHAR(30) NOT NULL, SEATS INT, PRIMARY KEY(STADIUM_ID))";
      connection.query(stadiumTable, (err, res) => {
        if (err) throw err;
        console.log("STADIUM Table created!");
      });

      const matchesTable =
        "CREATE TABLE IF NOT EXISTS MATCHES (MATCH_ID INT NOT NULL AUTO_INCREMENT , MATCH_DATE DATE, MATCH_TIME VARCHAR(20), STADIUM_ID INT, TEAM_1 VARCHAR(50), TEAM_2 VARCHAR(50), PRIMARY KEY(MATCH_ID), FOREIGN KEY (STADIUM_ID) REFERENCES STADIUMS(STADIUM_ID))";
      connection.query(matchesTable, (err, res) => {
        if (err) throw err;
        console.log("matches Table created!");
      });

      const seatsTable =
        "CREATE TABLE IF NOT EXISTS SEATS (SEAT_ID INT NOT NULL AUTO_INCREMENT, MATCH_ID INT, SEAT_NUMBER INT, BOOKED INT, CATEGORY VARCHAR(10), PRIMARY KEY(SEAT_ID), CONSTRAINT UC_SEAT UNIQUE(MATCH_ID, SEAT_NUMBER), FOREIGN KEY(MATCH_ID) REFERENCES MATCHES(MATCH_ID) ON DELETE CASCADE)";
      connection.query(seatsTable, (err, res) => {
        if (err) throw err;
        console.log("SEATS Table created!");
      });

      const bookingsTable =
        "CREATE TABLE IF NOT EXISTS BOOKINGS (BOOKING_ID INT NOT NULL AUTO_INCREMENT , email VARCHAR(255), MATCH_ID INT, PRIMARY KEY(BOOKING_ID), FOREIGN KEY (MATCH_ID) REFERENCES MATCHES(MATCH_ID), FOREIGN KEY (email) REFERENCES users(email))";
      connection.query(bookingsTable, (err, res) => {
        if (err) throw err;
        console.log("bookings Table created!");
      });

      const userSeats =
        "CREATE TABLE IF NOT EXISTS USER_SEATS (BOOKING_ID INT, SEAT_ID INT, PRIMARY KEY(BOOKING_ID,SEAT_ID), FOREIGN KEY (BOOKING_ID) REFERENCES BOOKINGS(BOOKING_ID), FOREIGN KEY (SEAT_ID) REFERENCES SEATS(SEAT_ID))";
      connection.query(userSeats, (err, res) => {
        if (err) throw err;
        console.log("User SEAT Table created!");
      });
    }
  });
});

//adding seats in a loop is becoming a challenge

// router.get("/addseats", (req, res) => {
//   const sql = "SELECT MATCH_ID, STADIUM_ID FROM MATCHES";
//   connection
//     .promise()
//     .query(sql)
//     .then(([rows]) => {
//       //console.log(rows);
//       for (let row of rows) {
//         const sql2 = `SELECT SEATS FROM STADIUMS WHERE STADIUM_ID = ${row.STADIUM_ID}`;
//         connection
//           .promise()
//           .query(sql2)
//           .then(([seats]) => {
//             //console.log(seats, rows);
//             let seatsInStadium = seats[0].SEATS;
//             for (let i = 1; i <= seatsInStadium; ++i) {
//               let category;
//               if (i < seatsInStadium / 3) category = "A";
//               else if (i < (seatsInStadium * 2) / 3) category = "B";
//               else category = "C";
//               let sql3 = `INSERT INTO SEATS (MATCH_ID, SEAT_NUMBER, BOOKED, CATEGORY) VALUES (${row.MATCH_ID}, ${i}, 0 , '${category}')`;
//               connection.promise().query(sql3);
//             }
//           });
//       }
//     });
// });

module.exports = router;
