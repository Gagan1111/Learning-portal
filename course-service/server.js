const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/courseRoutes");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/course-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Log database connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});


// Middleware
app.use(express.json());

// Routes
app.use("/api", courseRoutes);

// Start server
app.listen(5002, () => {
  console.log("Course Service running on port 5002");
});
