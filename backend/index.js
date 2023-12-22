const express = require("express");
const app = express();
const cors = require("cors");

//middleware to use the cors
app.use(cors());

/**
 * 2 types of users:
 * admin users which can create courses and can also consume courses
 * regaulr users who can also buy and only can use consume that content
 * right now storing in memory ,later shift to mongodb using the driver
 */

let USERS = [];

//signup for users
app.post("/user/signup", (req, res) => {
  //take username and password of the user and push to USERS object array
  // take username and password from the body
  // and create a timestamp for easy logging.
  let timestamp = new Date().getTime();
  let userObject = {
    username: req.body.username,
    password: req.body.password,
  };
  USERS.push(userObject);
  //send a 200 ok message and a response
  res.status(200).json({
    message: `User ${username} has been created  successfully at ${timestamp}`,
  });
});

//signin for users
app.post("/user/login", (req, res) => {
  //check in the uses array if some user with the same username and password in this body exists or not

  const exists = USERS.find(
    (item) =>
      item.username === req.body.username && item.password === req.body.password
  );
  // if item exists, then allow acccess,else return 404
  if (exists) {
    res.status(200).json({
      message: `User ${username} logged in successfully !`,
    });
  } else {
    res.status(403).json({
      message: `Invalid user ${username}!`,
    });
  }
});

app.app.listen(3000, () => {
  console.log(`Server started listening on port 3000`);
});
