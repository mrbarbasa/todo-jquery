var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function saveTodoList(content, filepath) {
  var fp = filepath || './public/todo_save.txt';
  var data = fs.writeFile(fp, content, function(err) {
    if (err) {
      console.log('Error writing to ' + fp);
    }
  });
}

app.post('/save', function(req, res) {
  console.log(req.body);
  saveTodoList(req.body.savedTodos);
  res.send("Todo list was saved");
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});