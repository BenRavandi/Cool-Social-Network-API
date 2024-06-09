// Import necessary modules from mongoose
const { connect, connection } = require('mongoose');

// Connect to the MongoDB database named socialDB running on localhost
connect('mongodb://127.0.0.1:27017/socialDB');

// Export the connection object
module.exports = connection;