const router = require("express").Router();
const {
  createUser,
  loginUser,
  userProfile,
  logout,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, userProfile); // Added verifyToken middleware here
router.post("/logout", logout);

module.exports = router;
