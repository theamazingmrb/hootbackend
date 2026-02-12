const mongoose = require('mongoose');

mongoose.connect(process.env.ISPROD ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on('error', () => {
  console.log(`Error connecting to MongoDB ${mongoose.connection.name}.`);
});