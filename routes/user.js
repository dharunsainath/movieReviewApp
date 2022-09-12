const express = require("express");


const { create , verifyEmail, resendEmailVerification} = require("../controllers/user");
const { userValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post("/create", userValidator,validate , create);
router.post("/verify-email",  verifyEmail);
router.post("/resend-email",  resendEmailVerification);

module.exports = router;
