// Import necessary modules
const { User, Thought } = require("../models");

module.exports = {
  // Get all Thoughts
  async getThoughts(req, res) {
    try {
      // We use $in operator to find thoughts where the username exists in the distinct list of usernames from the User model.
      // This way, only thoughts with matching usernames will be included in the response.
      const thoughts = await Thought.find({
        username: { $in: await User.distinct("username") },
      });
      const thoughtObj = {
        thoughts,
      };
      res.json(thoughtObj);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        //! Does await include the entire chain?
        _id: req.params.thoughtId,
      })
        .select("-__v")
        .populate({
          path: "reactions",
          select: "reactionBody username",
        });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // POST a new Thought
  async createThought(req, res) {
    try {
      // Create the new thought
      const thought = await Thought.create(req.body);

      // Check if the username is provided
      if (!req.body.username) {
        return res
          .status(400)
          .json({ message: "Username is required to create a thought." });
      }

      // Find the user by username
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res
          .status(404)
          .json({ message: "That username does not exist." });
      }

      // Associate the new thought with the user if the user exists
      user.thoughts.push(thought);
      await user.save();
      await thought.save();

      res.json(thought);
      //The code will now check for the specific Mongoose validation error related to the username field and return your custom error message if that specific validation fails.
    } catch (error) {
      if (error.name === "ValidationError" && error.errors.username) {
        return res
          .status(400)
          .json({ message: "Username is required to create a thought." });
      } else {
        // Handle other errors or send a generic error message
        console.error(error);
        res
          .status(500)
          .json({ message: "An error occurred while creating the thought." });
      }
    }
  },
  // PUT updates to a Thought
  async updateThought(req, res) {
    console.log("You are updating a thought!");
    console.log(req.body);

    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        req.body,
        { new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID :(" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
      console.error(err);
      // console.log(err)
    }
  },
  // DELETE a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No such thought exists" });
      }

      // Remove the thought ID from the associated user's thoughts array
      const user = await User.findOne({ username: thought.username });

      if (user) {
        user.thoughts.pull(thought._id);
        await user.save();
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // POST a reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "No thought!" });
      }

      const newReaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };

      // Check if the username is provided
      if (!req.body.username) {
        return res
          .status(400)
          .json({ message: "Username is required to create a reaction." });
      }

      // Find the user by username
      const user = await User.findOne({ username: req.body.username });

      // Check if the username match
      if (!user) {
        return res
          .status(404)
          .json({ message: "That username does not exist." });
      }

      thought.reactions.push(newReaction);
      await thought.save();

      res.status(201).json({ message: "Reaction created", thought });
    } catch (error) {
      if (error.name === "ValidationError" && error.errors.username) {
        return res
          .status(400)
          .json({ message: "Username is required to create a reaction." });
      } else {
        // Handle other errors or send a generic error message
        console.error(error);
        res
          .status(500)
          .json({ message: "An error occurred while creating the reaction." });
      }
    }
  },
  // DELETE a reaction
  async deleteReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionId } = req.body;

      console.log(
        "Received request with thoughtId:",
        thoughtId,
        "and reactionId:",
        reactionId
      );

      // Validate thoughtId and reactionId
      if (!thoughtId || !reactionId) {
        console.log(
          "Invalid input. thoughtId:",
          thoughtId,
          "reactionId:",
          reactionId
        );
        return res.status(400).json({ message: "Invalid input!" });
      }

      const thought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        {
          $pull: {
            reactions: { _id: reactionId },
          },
        },
        { new: true }
      );

      if (!thought) {
        console.log("No thought found for thoughtId:", thoughtId);
        return res.status(404).json({ message: "No thought found!" });
      }

      console.log("Reaction deleted. New thought:", thought);
      res.json({ message: "Reaction deleted", thought });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
