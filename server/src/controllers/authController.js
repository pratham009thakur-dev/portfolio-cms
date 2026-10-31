const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc   Admin login
// @route  POST /api/auth/login
// @access Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get admin profile verification
// @route  GET /api/auth/profile
// @access Private
const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
};