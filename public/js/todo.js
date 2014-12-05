$(function() {

  $("#todo_input").keypress(function(e) {
    if (e.which === 13) { // When Enter key is pressed, process the input
      var input = $(this);
      var todoText = input.val(); // Save the value before clearing it
      input.val(""); // Clear out the text after Enter is pressed

      var todoItem = $("<li>", {
        class: "todo_item",
        html: $("<input>", {
          type: "checkbox"
        })
      });
      todoItem.append(todoText);
      $("#todos").append(todoItem);
    }
  });

  // On click or on change works
  $("#todos").on("change", ".todo_item input[type=checkbox]", function() {
    var listItem = $(this).parent();

    // if ($(this).is(":checked")) { // Alternative
    if (this.checked) { // If user checked
      listItem.addClass("todo_item_completed");
    }
    else { // If user unchecked
      if (listItem.hasClass("todo_item_completed")) {
        listItem.removeClass("todo_item_completed");
      }
    }
  });
});
