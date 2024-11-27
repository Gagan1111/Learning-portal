const Course = require('../models/courseModel');
const User = require('../../user-service/models/userModel');

// Create a new course (Admin only)
exports.createCourse = async (req, res) => {
  const { title, description, instructor, duration, category, level, thumbnail, language } = req.body;

  try {
    const course = new Course({
      title,
      description,
      instructor,
      duration,
      category,
      level,
      thumbnail,
      language,
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: `Error creating course: ${error.message}` });
  }
};

// Get all courses (Student and Admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: `Error fetching courses: ${error.message}` });
  }
};

// Get a particular course (Student and Admin)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: `Error fetching course: ${error.message}` });
  }
};

// Delete a course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting course: ${error.message}` });
  }
};

// Update a course (Admin only)
exports.updateCourse = async (req, res) => {
  const { title, description, instructor, duration, category, level, thumbnail, language } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.instructor = instructor || course.instructor;
    course.duration = duration || course.duration;
    course.category = category || course.category;
    course.level = level || course.level;
    course.thumbnail = thumbnail || course.thumbnail;
    course.language = language || course.language;

    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: `Error updating course: ${error.message}` });
  }
};

// Get all users enrolled in a particular course (Student and Admin)
exports.getUsersEnrolledInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('studentsEnrolled');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.studentsEnrolled);
  } catch (error) {
    res.status(500).json({ message: `Error fetching enrolled users: ${error.message}` });
  }
};

// Enroll a student in a course
exports.enrollStudentInCourse = async (req, res) => {
  const { userId } = req.body;
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can be enrolled in courses' });
    }

    // Add the course to the user's coursesEnrolled array
    user.coursesEnrolled.push(courseId);
    await user.save();

    // Add the student to the course's studentsEnrolled array
    course.studentsEnrolled.push(userId);
    await course.save();

    res.json({ message: 'Student enrolled in course successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error enrolling student in course: ${error.message}` });
  }
};