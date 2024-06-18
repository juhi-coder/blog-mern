const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret =process.env.SECRET_KEY

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  var salt = bcrypt.genSaltSync(10);
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required " });
    }
    const userDoc = await userModel.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (e) {
    res.status(500).json({ error: `Internal server error ${e.message}` });
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
        if (err) throw err;
        res.cookie("token", token).json({ id: userDoc._id, email });
      });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } catch (e) {
    res.status(500).json({ error: `Internal server error ${e.message}` });
  }
};

const userProfile = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    res.json(info);
  });
};

const logout = (req, res) => {
  res.cookie("token", "").json("ok");
};

module.exports = { createUser, loginUser, userProfile, logout };
