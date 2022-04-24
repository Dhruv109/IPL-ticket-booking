//making the database
const connection = require("../db");

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
      "CREATE TABLE IF NOT EXISTS STADIUMS (STADIUM_ID INT AUTO_INCREMENT NOT NULL, STADIUM_NAME VARCHAR(30) NOT NULL, SEATS INT, PRIMARY KEY(STADIUM_ID))";
    connection.query(stadiumTable, (err, res) => {
      if (err) throw err;
      console.log("STADIUM Table created!");
    });

    const matchesTable =
      "CREATE TABLE IF NOT EXISTS MATCHES (MATCH_ID INT AUTO_INCREMENT NOT NULL, MATCH_DATE DATE, MATCH_TIME VARCHAR(20), STADIUM_ID INT, TEAM_1 VARCHAR(50), TEAM_2 VARCHAR(50), PRIMARY KEY(MATCH_ID), FOREIGN KEY (STADIUM_ID) REFERENCES STADIUMS(STADIUM_ID))";
    connection.query(matchesTable, (err, res) => {
      if (err) throw err;
      console.log("matches Table created!");
    });

    const seatsTable =
      "CREATE TABLE IF NOT EXISTS SEATS (STADIUM_ID INT, SEAT_NUMBER INT, BOOKED INT, PRIMARY KEY(STADIUM_ID, SEAT_NUMBER), FOREIGN KEY(STADIUM_ID) REFERENCES STADIUMS(STADIUM_ID) ON DELETE CASCADE)";
    connection.query(seatsTable, (err, res) => {
      if (err) throw err;
      console.log("SEATS Table created!");
    });

    const bookingsTable =
      "CREATE TABLE IF NOT EXISTS BOOKINGS (BOOKING_ID INT AUTO_INCREMENT NOT NULL, email VARCHAR(255), MATCH_ID INT, PRIMARY KEY(BOOKING_ID), FOREIGN KEY (MATCH_ID) REFERENCES MATCHES(MATCH_ID), FOREIGN KEY (email) REFERENCES users(email))";
    connection.query(bookingsTable, (err, res) => {
      if (err) throw err;
      console.log("bookings Table created!");
    });

    const userSeats =
      "CREATE TABLE IF NOT EXISTS USER_SEATS (BOOKING_ID INT, SEAT_NUMBER INT, PRIMARY KEY(BOOKING_ID, SEAT_NUMBER), FOREIGN KEY (BOOKING_ID) REFERENCES BOOKINGS(MATCH_ID)) ,FOREIGN KEY (SEAT_NUMBER) REFERENCES SEATS(SEAT_NUMBER))";
    connection.query(userSeats, (err, res) => {
      if (err) throw err;
      console.log("User SEAT Table created!");
    });
  }
});
