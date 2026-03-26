const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get patients for care_manager (non-managers)
router.get('/', protect, authorize('care_manager'), async (req, res) => {
  try {
    const patients = await User.find({
      role: { $in: ['parent', 'child'] }
    }).select('-password').sort({ name: 1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle workable status
router.patch('/:id/workable', protect, authorize('care_manager'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !['parent', 'child'].includes(user.role)) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    user.workable = !user.workable;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        workable: user.workable
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

