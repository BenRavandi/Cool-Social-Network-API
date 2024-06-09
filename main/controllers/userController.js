// Import necessary modules
const { User, Thought } = require("../models");

module.exports = {
  // GET all Users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
        // headCount: await headCount(),
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // GET a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        // Populate friends and thoughts for single user.
        .populate([
          {
            path: "thoughts",
            select: "thoughtText reactions",
          },
          {
            path: "friends",
          },
        ]);

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      if (!user.friends) {
        console.error("Error: 'friends' field is not populated");
        return res.status(500).json({ message: "Failed to populate 'friends' field" });
      }

      console.log("Populated 'friends' field:", user); // Added this line for debugging


      res.json(user); //! Works if destructuring or not.
    } catch (err) {
      console.log("An error occured:", err);
      return res.status(500).json(err);
    }
  },
  // POST a new User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // PUT updates to a single user
  async updateUser(req, res) {
    console.log("You are updating a user!");
    console.log(req.body);

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with that ID :(" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // DELETE an existing user
  async deleteUser(req, res) {
    try {
      // Find the user by ID
      const user = await User.findById(req.params.userId);

      //If user does not exist descrioptive error message.
      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      // Find and delete all thoughts associated with the user before deleting the user
      await Thought.deleteMany({ username: user.username });

      // Delete the user
      await User.findByIdAndRemove(req.params.userId);

      res.json({ message: "User successfully deleted. No thinking allowed." });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // POST to add a friend to an existing user
  async addUserFriend(req, res) {
    try {
      //Get both user and friend.
      const user = await User.findById({ _id: req.params.userId });
      const friend = await User.findById({ _id: req.params.friendId });

      //Check if both user and friend exist.
      if (!user || !friend) {
        return res
          .status(404)
          .json({ message: "Either user or friend does not exist." });
      }

      //Check if they are already friends.
      if (user.friends.includes(friend._id)) {
        return res.status(400).json({ message: "Users are already friends" });
      }

      //Add new friend to users friend list.
      user.friends.push(friend._id);
      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  async deleteUserFriend(req, res) {
    try {
      //Get both user and friend.
      const user = await User.findById({ _id: req.params.userId });
      const friend = await User.findById({ _id: req.params.friendId });

      //Check if both user and friend exist.
      if (!user || !friend) {
        return res
          .status(404)
          .json({ message: "Either user or friend does not exist." });
      }

      //Only delete if the user is already a friend.
      if (user.friends.includes(friend._id)) {
        user.friends.pull(friend._id);
        await user.save();
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};
