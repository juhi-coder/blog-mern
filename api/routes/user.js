const router = require("express").Router();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const {
  createUser,
  loginUser,
  userProfile,
  logout,
} = require("../controllers/user");
const { createPost, getPost, getPostById,editPost } = require("../controllers/post");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", userProfile);
router.post("/logout", logout);
router.post("/post", uploadMiddleware.single("file"), createPost);
router.get("/post", getPost);
router.get("/post/:id", getPostById);
router.put("/post",uploadMiddleware.single("file"),editPost);


module.exports = router;
