const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/user-service", {
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
app.use("/api", userRoutes);

// Start server
app.listen(5001, () => {
  console.log("User Service running on port 5001");
});
