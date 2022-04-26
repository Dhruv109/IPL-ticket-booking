const router = require("express").Router();
const db = require("../db");
let matches, seatsCount, ticket;
router.get("/match/:id", (req, res) => {
  console.log(req.params.id);
  const sql = `SELECT * FROM MATCHES NATURAL JOIN STADIUMS WHERE MATCH_ID = ${req.params.id}`;
  db.promise()
    .query(sql)
    .then((match) => {
      matches = match[0][0];
      // res.render("booking.ejs", { match: match[0][0] });
    })
    .then((r) => {
      const getSeats = `SELECT SEATS.CATEGORY, COUNT(SEATS.CATEGORY) AS COUNT, PRICE FROM SEATS JOIN SEAT_CATEGORY ON SEATS.CATEGORY = SEAT_CATEGORY.CATEGORY WHERE MATCH_ID = ${req.params.id} AND BOOKED = 0 GROUP BY CATEGORY`;
      db.promise()
        .query(getSeats)
        .then((result) => {
          //console.log(result);
          seatsCount = result[0];
        })
        .then((r2) => {
          // console.log(seatsCount);
          res.render("booking.ejs", {
            match: matches,
            seats: seatsCount,
          });
        });
    });
});

router.post("/book", (req, res) => {
  console.log(req.body.category);
  let seat = seatsCount.filter((s) => s.CATEGORY == req.body.category);
  console.log(seat);
  if (seat.COUNT < req.body.noOfSeats) {
    req.flash("error", "Seats Unavailable");
  } else {
    const sql = `SELECT * FROM SEATS WHERE MATCH_ID = ${matches.MATCH_ID} AND CATEGORY = '${req.body.category}' AND BOOKED = 0 LIMIT ${req.body.noOfSeats}`;

    let mySeats = [],
      mySeatIDs = [];
    db.promise()
      .query(sql)
      .then((seats) => {
        console.log(seats[0]);
        seats[0].forEach((seat) => {
          mySeats.push(seat.SEAT_NUMBER);
          mySeatIDs.push(seat.SEAT_ID);
        });
        ticket = {
          match_id: matches.MATCH_ID,
          team_1: matches.TEAM_1,
          team_2: matches.TEAM_2,
          city: matches.STADIUM_NAME,
          date: matches.MATCH_DATE.toDateString(),
          time: matches.MATCH_TIME,
          category: req.body.category,
          seats: mySeats,
          seatIDs: mySeatIDs,
          cost: seat[0].PRICE * req.body.noOfSeats,
        };
        res.render("booking.ejs", {
          match: matches,
          seats: seatsCount,
          ticket: ticket,
        });
      });
  }
});

router.get("/finalbooking", (req, res) => {
  if (!ticket) res.status(400).send("No ticket");
  else {
    const sql = `INSERT INTO BOOKINGS (email, MATCH_ID) VALUES ('${req.session.user.email}', ${ticket.match_id}); SELECT LAST_INSERT_ID()`;
    db.promise()
      .query(sql)
      .then((result) => {
        console.log(result[0][0].insertId);
        ticket.seatIDs.forEach((seat) => {
          const sql2 = `INSERT INTO USER_SEATS VALUES (${result[0][0].insertId}, ${seat}); 
                      UPDATE SEATS SET BOOKED = 1 WHERE SEAT_ID = ${seat}`;
          db.promise()
            .query(sql2)
            .then((r) => {
              console.log("User seats entered and updated in table");
            });
        });
      })
      .then(() => {
        res.redirect("./mybookings");
      });
  }
});

router.get("/mybookings", (req, res) => {
  if (!req.session.user) res.redirect("/rl/login");
  else {
    let tickets = [];
    let promises = [];
    const sql = `SELECT * FROM BOOKINGS NATURAL JOIN (MATCHES NATURAL JOIN STADIUMS) WHERE email = '${req.session.user.email}'`;
    db.promise()
      .query(sql)
      .then((bookings) => {
        //  console.log(bookings[0]);
        bookings[0].forEach((booking) => {
          const sql2 = `SELECT * FROM USER_SEATS NATURAL JOIN SEATS WHERE BOOKING_ID = ${booking.BOOKING_ID}`;
          promises.push(
            db
              .promise()
              .query(sql2)
              .then((seats) => {
                let s = [];
                seats[0].forEach((seat) => s.push(seat.SEAT_NUMBER));

                let ticket = {
                  match_id: booking.MATCH_ID,
                  team_1: booking.TEAM_1,
                  team_2: booking.TEAM_2,
                  city: booking.STADIUM_NAME,
                  date: booking.MATCH_DATE.toDateString(),
                  time: booking.MATCH_TIME,
                  category: seats[0][0].CATEGORY,
                  seats: s,
                };
                // console.log(ticket);
                tickets.push(ticket);
              })
          );
        });
        return Promise.all(promises);
      })
      .then((r) => {
        console.log(tickets);
        res.render("mybookings.ejs", { bookings: tickets });
      });
  }
});

//error with ejs passing a object that is valid on if statement only
module.exports = router;
