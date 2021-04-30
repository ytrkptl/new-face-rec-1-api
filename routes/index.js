const express = require("express")
const router = express.Router();
const path = require("path"); // comes with Express.
const db = require("../db")
const bcrypt = require("bcryptjs");

// controllers
const { handleRegisterWithEmail } = require("../controllers/register/register-step-1");
const { handleRegisterWithEmail2 } = require("../controllers/register/register-step-1-new");
const { registerAuthentication } = require("../controllers/register/register-step-2");
const  { signinAuthentication } = require("../controllers/signin");
const {handleForgotPassword} = require("../controllers/forgot/forgot-step1");
const {handleResetId} = require("../controllers/forgot/forgot-step2");
const {handleUpdateNewPassword} = require("../controllers/forgot/forgot-step3");
const { handleProfileGet, handleProfileUpdate, handleProfilePhoto } = require("../controllers/profile");
const { handleImage, handleApiCall } = require("../controllers/image");
const { requireAuth } = require("../controllers/authorization");
const { removeAuthToken } = require("../controllers/signout");
const { handleSubscribe } = require("../controllers/mailchimp");

router.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

router.get("/favicon.ico", (req, res) => res.status(204));

router.post("/signin", signinAuthentication(db, bcrypt));

router.post("/register-step-1", (req, res) => handleRegisterWithEmail(db, bcrypt, req, res));

router.post("/register-step-1-new", (req, res) => handleRegisterWithEmail2(db, bcrypt, req, res));

router.post("/register-step-2", registerAuthentication(db, bcrypt));

router.post("/forgot", (req, res) => handleForgotPassword(db, req, res));

router.post("/reset", (req, res) => handleResetId(req, res));

router.post("/update-new-password", (req, res) => handleUpdateNewPassword(req, res, db, bcrypt));

router.get("/profile/:id", requireAuth, (req, res) => handleProfileGet(req, res, db));

router.post("/profile/:id", requireAuth, (req, res) => handleProfileUpdate(req, res, db));

router.post("/upload/:id", requireAuth, (req, res) => handleProfilePhoto(req, res, db));

router.put("/image", requireAuth, (req, res) => handleImage(req, res, db));

router.post("/imageurl", requireAuth, (req, res) => handleApiCall(req, res));

router.delete("/signout", (req, res) => removeAuthToken(req, res));

router.post("/subscribe", (req, res) => handleSubscribe(req, res));

module.exports = router