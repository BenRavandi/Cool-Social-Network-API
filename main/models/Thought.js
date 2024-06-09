const { Schema, model } = require("mongoose");

// Define the reaction subdocument schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (createdAt) {
        // Format the timestamp using your preferred method:
        return new Date(createdAt).toLocaleString();
      },
    },
  },
  {
    toJSON: { getters: true }, // Apply getters to JSON output
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (createdAt) {
        // Format the timestamp using your preferred method:
        return new Date(createdAt).toLocaleString();
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // reactionSchema subdocument of thoughtSchema
  },
  {
    toJSON: {
      virtuals: true,
      getters: true, // Enable getters to apply to JSON output
    },
    id: false,
  }
);

// Define a virtual field to get the count of reactions for a thought
thoughtSchema.virtual("reactionCount").get(function () {
  return Array.isArray(this.reactions) ? this.reactions.length : 0;
});

// Create the Thought model based on the thought schema
const Thought = model("Thought", thoughtSchema);

// Export the Thought model
module.exports = Thought;
