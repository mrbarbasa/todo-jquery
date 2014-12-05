$(function() {

  $("#todo_input").keypress(function(e) {
    if (e.which === 13) { // When Enter key is pressed, process the input
      var input = $(this);
      var todoText = input.val(); // Save the value before clearing it
      input.val(""); // Clear out the text after Enter is pressed

      var todoItem = $("<li>", {
        html: todoText
      });
      $("#todos").append(todoItem);
    }
  })
});
