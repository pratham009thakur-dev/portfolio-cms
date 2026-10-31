const Project = require('../models/Project');

// @desc   Get all projects
// @route  GET /api/projects
// @access Public
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create new project
// @route  POST /api/projects
// @access Private (Admin)
const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured, order } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies: Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((item) => item.trim()),
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      imageUrl: imageUrl || undefined,
      featured: Boolean(featured),
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update project
// @route  PUT /api/projects/:id
// @access Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured, order } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (technologies !== undefined) {
      project.technologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((item) => item.trim());
    }
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (imageUrl !== undefined) project.imageUrl = imageUrl;
    if (featured !== undefined) project.featured = Boolean(featured);
    if (order !== undefined) project.order = Number(order);

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete project
// @route  DELETE /api/projects/:id
// @access Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};