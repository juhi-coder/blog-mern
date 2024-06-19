const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require("../middleware/verifyToken"); // Import verifyToken middleware

const secret = process.env.SECRET_KEY;

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userDoc = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json(userDoc);
  } catch (e) {
    res.status(500).json({ error: `Internal server error: ${e.message}` });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const userDoc = await userModel.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({ error: "User not found" });
    }

    const pswdOk = bcrypt.compareSync(password, userDoc.password);
    if (pswdOk) {
      jwt.sign({ email, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          console.error("Token generation error:", err);
          return res
            .status(500)
            .json({ error: "Internal server error during token generation" });
        }
        res.json({ id: userDoc._id, email, token });
      });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: `Internal server error: ${e.message}` });
  }
};

const userProfile = async (req, res) => {
  try {
    // Token verification middleware added here
    verifyToken(req, res, async () => {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
          console.error("Token verification error:", err);
          return res.status(401).json({ error: "Unauthorized" });
        }
        res.json(info);
      });
    });
  } catch (e) {
    console.error("Profile error:", e);
    res.status(500).json({ error: `Internal server error: ${e.message}` });
  }
};

const logout = (req, res) => {
  res.json({ token: "" });
};

module.exports = { createUser, loginUser, userProfile, logout };
