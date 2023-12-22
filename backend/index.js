const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//middleware to use the cors
app.use(cors());

//generate a JWTToken for easier accesa dn verifying authentication
//storing the secret keys in .env files
const secretKey = process.env.SECRET_KEY;

function generateJWT(profile) {
  //generate a token for each profile
  const payload = { username: profile.username };
  return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

//to also check if the authentication is valid or not
function authenticateJWT(req, res, next) {
  //middleware to check jwt authentication and handleing them
  const authHeader = req.header.authorization;

  if (authHeader) {
    // of the form bearer<space>token
    const token = authHeader.split(" ")[1];
    //and verify
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403).json({
          message: `JWT AUTH Failed!`,
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401).json({
      message: "Now please authenticate yourself!",
    });
  }
}

/**
 * 2 types of users:
 * admin users which can create courses and can also consume courses
 * regaulr users who can also buy and only can use consume that content
 * right now storing in memory ,later shift to mongodb using the driver
 */

let USERS = [];
let ADMINS = [];

let COURSES = [];

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

//signup for admins
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const adminExists = ADMINS.find((adm) => adm.username === admin.username);

  //if exisitng admin throw erroe that cant create new admins
  if (adminExists) {
    res.status(403).json({
      message: `Admin already exists!`,
    });
  } else {
    //add to the admins list
    const timestamp = new Date().getTime();
    ADMIN.push(admin);
    res.status(200).json({
      message: `Admin ${admin.username} created at ${timestamp} !`,
    });
  }
});

//signing for admins
app.post(`/admin/signin`, (req, res) => {
  //check if already creds exists, then generate token for them and logged them in
  //else thriough error 403 and exit
  const { admUsername, admPassword } = req.headers;
  const adm = ADMINS.find(
    (adm) => adm.username === admUsername && adm.password == admPassword
  );

  if (adm) {
    //then exist , create token and log in
    const timestamp = new Date().getTime();
    const token = generateJWT(adm);
    res.status(200).json({
      message: `Admin ${adm.username} logged in at ${timestamp}`,
      token 
    });
  } else {
    res.status(403).json({
        message:`Admin ${adm.username} failed to log in!`
    })
  }
});

app.app.listen(3000, () => {
  console.log(`Server started listening on port 3000`);
});
