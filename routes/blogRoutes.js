const express = require("express");
const router = express.Router();
const { getBlogs, createBlog,deleteBlog,editBlog,updateBlog,viewBlog } = require("../controllers/blogController");
const multer = require("multer");
const path = require("path");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    // Make filename unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter files to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// Create a blog with image upload
router.post("/blogs", upload.single("image"), createBlog);
router.get("/blogs", getBlogs);
router.delete("/blogs/delete/:id",deleteBlog);
router.get("/blogs/:id/edit",editBlog);
router.get("/blogs/:id/view",viewBlog);
router.put("/blogs/:id/update", upload.single("image"), updateBlog);

module.exports = router;