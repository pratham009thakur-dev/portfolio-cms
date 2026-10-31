const ContactMessage = require('../models/ContactMessage');

// @desc   Submit a contact message
// @route  POST /api/contact
// @access Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please fill in all contact form fields.');
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all contact messages
// @route  GET /api/contact
// @access Private (Admin)
const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update message status (read / unread)
// @route  PATCH /api/contact/:id
// @access Private (Admin)
const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    message.isRead = req.body.isRead !== undefined ? Boolean(req.body.isRead) : !message.isRead;
    const updated = await message.save();

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete contact message
// @route  DELETE /api/contact/:id
// @access Private (Admin)
const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getMessages,
  updateMessageStatus,
  deleteMessage,
};