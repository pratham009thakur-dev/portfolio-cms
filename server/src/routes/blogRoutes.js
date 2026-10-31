const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogByIdentifier,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBlogs).post(protect, createBlog);
router.route('/:identifier').get(getBlogByIdentifier);
router.route('/:id').put(protect, updateBlog).delete(protect, deleteBlog);

module.exports = router;