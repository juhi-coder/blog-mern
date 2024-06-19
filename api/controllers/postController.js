const multer = require("multer");
const fs = require("fs");
const postModel = require("../models/postModel");

const createPost = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload required" });
  }
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  try {
    const postDoc = await postModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: req.user.id,
    });
    res.json(postDoc);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("author", ["email"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await postModel.findById(id).populate("author", ["email"]);
    res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editPost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;
  try {
    const postDoc = await postModel.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }
    const isAuthor =
      JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      return res
        .status(403)
        .json({ error: "You are not the author of this post" });
    }
    const updatedFields = {
      title,
      summary,
      content,
      cover: newPath || postDoc.cover,
    };
    // Ensure that you use postDoc.markModified(field) for non-atomic updates.
    await postDoc.updateOne(updatedFields);
    res.json({ message: "Post updated successfully", post: updatedFields });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createPost, getPost, getPostById, editPost };
