const userSeed = [
    {
        username: "Jennifer",
        email: "jennifer@example.com",
    },
    {
        username: "Kevin",
        email: "kevin@gmail.com",
    },
    {
        username: "Rose",
        email: "rose@outlook.com",
    },
    {
        username: "Brian",
        email: "brian@yahoo.com",
    },
    {
        username: "Elizabeth",
        email: "elizabeth@mail.com",
    },
];

const thoughtSeed = [
    {
        thoughtText: "You will never worry much about what others think of you if you realize how seldom they do.",
        username: "Jennifer",
    },
    {
        thoughtText: "No action breeds doubt and fear. Action breeds confidence and courage",
        username: "Kevin",
    },
    {
        thoughtText: "The only person one should try to be better than is the person you were yesterday",
        username: "Rose",
    },
    {
        thoughtText: "Success is not always final, and failure is not always fatal: the courage to continue that counts",
        username: "Brian",
    },
    {
        thoughtText: "Happy people plan actions. They don’t plan results.",
        username: "Elizabeth",
    },
];

// Export the functions for use in seed.js
module.exports = { userSeed, thoughtSeed }