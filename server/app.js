var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var CONNECTION_STRING = 'mongodb://localhost:27017/todosdb';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function connect_to_db(cb) {
  // Note the db name todosdb in the connection string
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if (err) {
      throw err;
    }

    // Find the collection todos (or create it if it doesn't already exist)
    var collection = db.collection('todos');

    cb(collection, db);
  });
}

app.get('/items', function(req, res) {

  connect_to_db(function(collection, db) {
    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
      db.close();
      res.send(results);
    }); // collection.find
  }); // connect_to_db

});

app.post('/item', function(req, res) {

  connect_to_db(function(collection, db) {
    // Insert a document into the collection
    collection.insert(req.body.new_item, function(err, arrayItem) {
      // Show the item that was just inserted; contains the _id field
      // Note that it is an array containing a single object
      console.log(arrayItem[0]._id);
      db.close();
      res.send(arrayItem[0]._id);
    }); // collection.insert
  }); // connect_to_db

});

app.put('/item', function(req, res) {

  connect_to_db(function(collection, db) {
    // var test = collection.find({ "_id": ObjectID(req.body._id) });
    collection.find({ "_id": new ObjectID(req.body._id) }).toArray(function(err, arrayItem) {
      arrayItem[0].completed = req.body.completed;

      collection.save(arrayItem[0], function(err, result) {
        res.send("Todo item was successfully updated");
      });

      db.close();
    }); // collection.find
  }); // connect_to_db

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
