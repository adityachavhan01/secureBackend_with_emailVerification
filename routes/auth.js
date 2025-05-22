const express = require("express");
const router = express.Router();
const { registerUser, verifyUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/verify-registration", verifyUser);  // changed to POST
router.post("/login", loginUser);                 // new route

module.exports = router;

// first routes
// http://localhost:5000/api/register
// {
//   "email": "your_email@example.com"
// }

// route 2
// http://localhost:5000/api/verify-registration
// {
//   "token": "the_verification_token_from_email_link",
//   "password": "your_password"
// }

// route 3
// http://localhost:5000/api/login
// {
//   "email": "your_email@example.com",
//   "password": "your_password"
// }








