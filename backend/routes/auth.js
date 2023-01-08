const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "mmm";

// Route-1 Create a user using :"POST /api/auth". No Log in required
router.post(
  "/",
  [
    body("email").isEmail(),
    body("password", "password cannot be blank").exists(),
    body("name").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are error retuen bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check whether email is already is exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email is already is exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const securedpassword = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: securedpassword,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = await jwt.sign(data, JWT_SECRET);
      console.log(authtoken + " and " + JWT_SECRET);

      // res.json(user)
      res.json({ authtoken });
    } catch (error) {
      //   .then(user => res.json(user));
      // res.send(req.body);
      // const user = User(req.body);
      // user.save();
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//ROUTE-2 Authenticate a user using "POST /api/auth/login". NO login Required
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are error return bad request and error
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please log in with correct details" });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res
          .status(400)
          .json({ error: "please log in with correct details" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = await jwt.sign(data, JWT_SECRET);
      console.log(authtoken + " and " + JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured"+error.message);
    }
  }
);

//ROUTE-3 Get loggein details using "POST /api/auth/getuser". login Required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    console.log("running from try ");
    const UserId = req.user.id;
    const user = await User.findById(UserId).select("-password");
    res.send(user);
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured"+error.message);
    res.json({error:error.message});
  }
});
module.exports = router;
