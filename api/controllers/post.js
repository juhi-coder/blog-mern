const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const postModel = require("../models/post");
const jwt = require("jsonwebtoken");

const secret = "juhikumari";

const createPost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, summary, content } = req.body;

    try {
      const postDocs = await postModel.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDocs);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

const getPost = async (req, res) => {
  try {
    const post = await postModel
      .find()
      .populate("author", ["email"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(post);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const postDoc = await postModel.findById(id).populate("author", ["email"]);
  res.json(postDoc);
};

const editPost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id, title, summary, content } = req.body;
      const postDoc = await postModel.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
      res.json(postDoc);
    });
  }
};
module.exports = { createPost, getPost, getPostById, editPost };
