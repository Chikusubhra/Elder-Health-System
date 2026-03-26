const express = require('express');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get recent alerts (all for care_manager, own for others)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'care_manager') {
      query.patientId = req.user._id;
    }
    const alerts = await Alert.find(query)
      .populate('patientId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get alerts for patient
router.get('/:patientId', protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ patientId: req.params.patientId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

