const db = require("../config/db");
const base_url = process.env.BASE_URL || "http://localhost:5000";
const createBlog = (req, res) => {
  const { title, tags,content } = req.body;
  const image = req.file ? req.file.filename : null; // multer file

  if (!title || !content || !image) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  db.query(
    "INSERT INTO blogs (title, tags, content, image) VALUES (?, ?, ?, ?)",
    [title, tags, content, image],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ msg: "Blog created successfully", blogId: results.insertId });
    }
  );
};
const getBlogs = (req, res) => {
  db.query("SELECT * FROM blogs", (err, results) => {
    if (err) return res.status(500).json(err);

    const blogs = results.map((blog) => {
      return {
        ...blog,
        image: `${base_url}/uploads/${blog.image}`,
      };
    });

    res.status(200).json(blogs);
  });
};
const deleteBlog = (req,res) => {
  const {id} = req.params;
  db.query("DELETE FROM blogs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ msg: "Blog deleted successfully" });
  });
};
const editBlog = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM blogs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const blog = results[0];
    blog.image = `${base_url}/uploads/${blog.image}`;
    res.status(200).json(blog);
  });
};
const updateBlog = (req, res) => {
  const { id } = req.params;
  const { title, tags, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  let query;
  let values;
  if (req.file) {
    query =
      "UPDATE blogs SET title = ?, tags = ?, content = ?, image = ? WHERE id = ?";
    values = [title, tags, description, req.file.filename, id];
  } else {
    query =
      "UPDATE blogs SET title = ?, tags = ?, content = ? WHERE id = ?";
    values = [title, tags, description, id];
  }
  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ msg: "Blog updated successfully" });
  });
};
const viewBlog = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM blogs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const blog = results[0];
    blog.image = `${base_url}/uploads/${blog.image}`;
    res.status(200).json(blog);
  });
};
module.exports = { createBlog, getBlogs,deleteBlog, editBlog,updateBlog,viewBlog };