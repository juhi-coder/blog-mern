const router = require("express").Router();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const {
  createPost,
  getPost,
  getPostById,
  editPost,
} = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");

router.post("/post", verifyToken, uploadMiddleware.single("file"), createPost);
router.get("/post", getPost);
router.get("/post/:id", getPostById);
router.put("/post/:id", verifyToken, uploadMiddleware.single("file"), editPost);

module.exports = router;
