const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.post("/signup", authControllers.signupUser);
router.post("/signin", authControllers.signinUser);

module.exports = router;
