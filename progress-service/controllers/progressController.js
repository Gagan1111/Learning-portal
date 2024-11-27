const Progress = require("../models/progressModel");

// Create a new progress record
exports.createProgress = async (req, res) => {
  const { userId, courseId, progressPercentage, completed, lastAccessed } = req.body;
  try {
    const progress = new Progress({ userId, courseId, progressPercentage, completed, lastAccessed });
    await progress.save();
    res.status(201).send(progress);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get progress for a specific user and course
exports.getProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      return res.status(404).send("Progress not found");
    }
    res.status(200).send(progress);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  const { progressPercentage, completed, lastAccessed } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { progressPercentage, completed, lastAccessed, notes, quizScores, assignments },
      { new: true, runValidators: true }
    );
    if (!progress) {
      return res.status(404).send("Progress not found");
    }
    res.status(200).send(progress);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete progress
exports.deleteProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await Progress.findOneAndDelete({ userId, courseId });
    if (!progress) {
      return res.status(404).send("Progress not found");
    }
    res.status(200).send("Progress deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};


// Get all progress records for a specific user with pagination
exports.getAllProgressForUser = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const progressRecords = await Progress.find({ userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalRecords = await Progress.countDocuments({ userId });

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      progressRecords,
    });
  } catch (error) {
    res.status(400).json({ message: `Error fetching progress records: ${error.message}` });
  }
};


// Get all progress records for a specific course with pagination
exports.getAllProgressForCourse = async (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const progressRecords = await Progress.find({ courseId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalRecords = await Progress.countDocuments({ courseId });

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      progressRecords,
    });
  } catch (error) {
    res.status(400).json({ message: `Error fetching progress records: ${error.message}` });
  }
};