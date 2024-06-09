const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { userSeed, thoughtSeed } = require('./data');

connection.on('error', (err) => {
    console.error(err);
    console.log("Logging error:", err);
});

connection.once('open', async () => {
    console.log('connected');
    try {
        // Remove existing data from collections
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Add users to the collections
        const users = await User.insertMany(userSeed);

        // Add thoughts to the collections        
        const thoughts = await Thought.insertMany(thoughtSeed);

        // Update each user to include the ObjectIDs of their thoughts
        for (const user of users) {
            user.thoughts = thoughts
                .filter(thought => thought.username === user.username)
                .map(thought => thought._id);

            await user.save();
        }

        // Log the seed data to indicate what should appear in the database
        console.table(users.map(user => user.toObject()));
        console.table(thoughts.map(thought => thought.toObject()));
        console.info('Seeding complete! 🌱');
    } catch (error) {
        console.error('Seeding error:', error);
    }
    process.exit(0);
});