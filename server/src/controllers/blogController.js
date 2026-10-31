const BlogPost = require('../models/BlogPost');

// @desc   Get all blogs (public: only published; admin: all)
// @route  GET /api/blogs
// @access Public / Admin
const getBlogs = async (req, res, next) => {
  try {
    const { category, search, includeUnpublished } = req.query;
    let query = {};

    if (includeUnpublished !== 'true') {
      query.isPublished = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const blogs = await BlogPost.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single blog by slug or ID
// @route  GET /api/blogs/:identifier
// @access Public
const getBlogByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    const blog = await BlogPost.findOne(query);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create blog post
// @route  POST /api/blogs
// @access Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, author, category, tags, isPublished } = req.body;

    let baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await BlogPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blog = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || undefined,
      author: author || 'Alex Rivera',
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      isPublished: Boolean(isPublished),
      publishedAt: isPublished ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update blog post
// @route  PUT /api/blogs/:id
// @access Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const { title, excerpt, content, coverImage, author, category, tags, isPublished } = req.body;

    if (title && title !== blog.title) {
      let baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      let slug = baseSlug;
      let counter = 1;
      while (await BlogPost.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
      blog.title = title;
    }

    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (author !== undefined) blog.author = author;
    if (category !== undefined) blog.category = category;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    if (isPublished !== undefined) {
      if (!blog.isPublished && isPublished) {
        blog.publishedAt = new Date();
      }
      blog.isPublished = Boolean(isPublished);
    }

    const updatedBlog = await blog.save();

    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete blog post
// @route  DELETE /api/blogs/:id
// @access Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogByIdentifier,
  createBlog,
  updateBlog,
  deleteBlog,
};