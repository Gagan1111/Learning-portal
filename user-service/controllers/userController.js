const { authorizeAdmin } = require("../middleware/auth");
const User = require("../models/userModel");

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: `Error fetching user details: ${error.message}` });
  }
};


// Update user details
exports.updateUserDetails = async (req, res) => {
  const { 
      name, username, email, role, coursesEnrolled, completedCourses,  contactNumber, address, preferences 
  } = req.body;

  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;
      user.coursesEnrolled = coursesEnrolled || user.coursesEnrolled;
      user.completedCourses = completedCourses || user.completedCourses;
      user.contactNumber = contactNumber || user.contactNumber;
      user.address = address || user.address;
      user.preferences = preferences || user.preferences;

      await user.save();

      res.json({ message: 'User details updated successfully' });
  } catch (error) {
      res.status(500).json({ message: `Error updating user details: ${error.message}` });
  }
};

// Delete a user (Admin only)
exports.deleteUser = [
  authorizeAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.remove();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
  }
];

// Get user details by email (Admin only)
exports.getUserDetailsByEmail = [
  authorizeAdmin,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: `Error fetching user details: ${error.message}` });
    }
  }
];


// Get all users (Admin only)
exports.getAllUsers = [
  authorizeAdmin,
  async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
  }
];

// Get courses a student is enrolled in
exports.getUserCourses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('coursesEnrolled');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can have enrolled courses' });
    }
    res.json(user.coursesEnrolled);
  } catch (error) {
    res.status(500).json({ message: `Error fetching user courses: ${error.message}` });
  }
};

// Get completed courses by a particular user
exports.getUserCompletedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('completedCourses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.completedCourses);
  } catch (error) {
    res.status(500).json({ message: `Error fetching completed courses: ${error.message}` });
  }
};
