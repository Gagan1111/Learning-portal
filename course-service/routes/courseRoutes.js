const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate, authorizeAdmin ,authorizeStudentOrAdmin} = require('../middleware/auth');

const router = express.Router();

// API versioning
const apiVersion = '/v1';

// Course routes
router.post(`${apiVersion}/courses`, authenticate, authorizeAdmin, courseController.createCourse);
router.get(`${apiVersion}/courses`, authenticate, courseController.getAllCourses);
router.get(`${apiVersion}/courses/:id`, authenticate, courseController.getCourseById);
router.delete(`${apiVersion}/courses/:id`, authenticate, authorizeAdmin, courseController.deleteCourse);
router.put(`${apiVersion}/courses/:id`, authenticate, authorizeAdmin, courseController.updateCourse);
router.get(`${apiVersion}/courses/:id/enrolled-users`, authenticate, authorizeAdmin, courseController.getUsersEnrolledInCourse);

// Route to enroll a student in a course
router.post(`${apiVersion}/courses/:id/enroll`, authenticate, authorizeStudentOrAdmin, courseController.enrollStudentInCourse);

module.exports = router;