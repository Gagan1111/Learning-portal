const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Personal Details
    name: 
    { 
      type: String, 
      required: true ,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Student", "admin"],
      default: "Student",
    },
    completedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    contactNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    preferences: {
      type: [String],
    },
    coursesEnrolled: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      validate: {
        validator: function() {
          return this.role === 'Student';
        },
        message: 'Only users with the role of Student can be enrolled in courses.'
      }
    }],
  },

  { timestamps: true }
);



// Method to generate auth token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET, // Replace with a strong secret key
    { expiresIn: '1h' }
  );
  return token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  return user;
};

// Method to update password
userSchema.methods.updatePassword = async function(newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
