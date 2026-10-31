const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(submitContact).get(protect, getMessages);
router.route('/:id').patch(protect, updateMessageStatus).delete(protect, deleteMessage);

module.exports = router;