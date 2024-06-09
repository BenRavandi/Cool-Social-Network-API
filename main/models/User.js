// Import necessary modules
const { Schema, model } = require("mongoose");

// Define the user schema to create the User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought", // Reference thought model
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Self-reference to User model for friends
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Define a virtual field to get the count of friends for a user
userSchema.virtual('friendCount').get(function () {
  return Array.isArray(this.friends) ? this.friends.length : 0; 
});

// Create the User model based on the user schema
const User = model("User", userSchema);

// Export the User model
module.exports = User;