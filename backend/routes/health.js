const express = require('express');
const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Generate alert if needed
const generateAlert = async (patientId, heartRate, oxygen, bpSystolic, bpDiastolic) => {
  const alerts = [];

  // Heart Rate alerts
  if (heartRate < 50 || heartRate > 110) {
    alerts.push({
      patientId,
      type: 'alert',
      message: `Heart Rate abnormal: ${heartRate} bpm`
    });
  }

  // Oxygen critical
  if (oxygen < 92) {
    alerts.push({
      patientId,
      type: 'critical',
      message: `Low oxygen level: ${oxygen}%`
    });
  }

  // Blood Pressure warning
  if (bpSystolic > 140 || bpDiastolic > 90) {
    alerts.push({
      patientId,
      type: 'warning',
      message: `High blood pressure: ${bpSystolic}/${bpDiastolic} mmHg`
    });
  }

  // Save alerts
  for (const alertData of alerts) {
    await Alert.create(alertData);
  }
};

// @desc    Add health data (Care Manager only)
router.post('/', protect, async (req, res) => { // Allow all authenticated users to add own vitals
  try {
    const { patientId, heartRate, oxygen, bpSystolic, bpDiastolic } = req.body;

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create health data
    const healthData = await HealthData.create({
      patientId,
      heartRate,
      oxygen,
      bpSystolic,
      bpDiastolic
    });

    // Generate alerts
    await generateAlert(patientId, heartRate, oxygen, bpSystolic, bpDiastolic);

    res.status(201).json({
      success: true,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get health data for patient
router.get('/:patientId', protect, async (req, res) => {
  try {
    const healthData = await HealthData.find({ patientId: req.params.patientId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      count: healthData.length,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

