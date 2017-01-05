var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = () => {
  MongoClient.connect(dburl, (err, db) => {
    if(err) {
      console.log('DB connection failed');
      return;
    }
    _connection = db;
    console.log('DB connection open', db);
  });
  //set connection
};

var get = () => {
  return _connection;
};

module.exports = {
  open: open,
  get: get
};