var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var secrets = require('./secrets');
// var CONNECTION_STRING = 'mongodb://localhost:27017/todosdb'; // DEV
var CONNECTION_STRING = secrets.connectionString; // PROD

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(CONNECTION_STRING);

var Todo = mongoose.model('Todo', { title: String, completed: String });

// Using mongodb module
// function connect_to_db(cb) {
//   // Note the db name todosdb in the connection string
//   MongoClient.connect(CONNECTION_STRING, function(err, db) {
//     if (err) {
//       throw err;
//     }

//     // Find the collection todos (or create it if it doesn't already exist)
//     var collection = db.collection('todos');

//     cb(collection, db);
//   });
// }

app.get('/items', function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      throw err;
    }
    else {
      res.send(todos);
    }
  });

  // Using mongodb module
  // connect_to_db(function(collection, db) {
  //   // Locate all the entries using find
  //   collection.find().toArray(function(err, results) {
  //     db.close();
  //     res.send(results);
  //   }); // collection.find
  // }); // connect_to_db
});

app.post('/item', function(req, res) {
  var todo = new Todo(req.body.new_item);
  todo.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      res.send(todo._id);
    }
  });

  // Using mongodb module
  // connect_to_db(function(collection, db) {
  //   // Insert a document into the collection
  //   collection.insert(req.body.new_item, function(err, arrayItem) {
  //     // Show the item that was just inserted; contains the _id field
  //     // Note that it is an array containing a single object
  //     // console.log(arrayItem[0]._id);
  //     db.close();
  //     res.send(arrayItem[0]._id);
  //   }); // collection.insert
  // }); // connect_to_db
});

app.put('/item', function(req, res) {
  Todo.update({
    "_id": new ObjectID(req.body._id)
  }, {
    "completed": req.body.completed
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.send('Todo item was successfully updated');
    }
  });

  // Using mongodb module
  // connect_to_db(function(collection, db) {
  //   collection.find({ "_id": new ObjectID(req.body._id) }).toArray(function(err, arrayItem) {
  //     arrayItem[0].completed = req.body.completed;

  //     collection.save(arrayItem[0], function(err, result) {
  //       res.send("Todo item was successfully updated");
  //     });

  //     db.close();
  //   }); // collection.find
  // }); // connect_to_db
});

app.delete('/item/:item_id', function(req, res) {
  Todo.remove({
    "_id": req.params.item_id
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.send('Todo item was successfully deleted');
    }
  })

  // Using mongodb module
  // connect_to_db(function(collection, db) {
  //   var _id = req.params.item_id;

  //   collection.remove({ "_id": new ObjectID(_id) }, function(err, result) {
  //     if (err) {
  //       throw err;
  //     }
      
  //     res.json({ success: "true" });

  //     db.close();
  //   }); // collection.remove
  // }); // connect_to_db
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
