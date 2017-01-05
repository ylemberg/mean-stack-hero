var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from ' + dburl);
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGINT)');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGTERM)');
    process.exit(0);
  });
});

process.once('SIGUSR2', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGUSR2)');
    process.kill(process.pid, 'SIGUSR2');
  });
});

//BRING IN SCHEMA AND MODELS
require('./hotels.model.js');
require('./users.model.js');