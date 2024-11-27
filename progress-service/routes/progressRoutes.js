const express = require('express');
const progressController = require('../controllers/progressController');
const { authenticate, authorizeStudentOrAdmin } = require('../middleware/auth');

const router = express.Router();

// API versioning
const apiVersion = '/v1';

// Progress routes
router.post(`${apiVersion}/progress`, authenticate, authorizeStudentOrAdmin, progressController.createProgress);
router.get(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.getProgress);
router.put(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.updateProgress);
router.delete(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.deleteProgress);
router.get(`${apiVersion}/progress/user/:userId`, authenticate, authorizeStudentOrAdmin, progressController.getAllProgressForUser);
router.get(`${apiVersion}/progress/course/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.getAllProgressForCourse);

module.exports = router;