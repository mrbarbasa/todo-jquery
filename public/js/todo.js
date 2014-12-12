$(function() {
  var itemsTotal = 0;
  var itemsCompleted = 0;

  function getItemsLeft() {
    return itemsTotal - itemsCompleted;
  }

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
      itemsTotal++;
      $("#todos_left").html(getItemsLeft());
    }
  });

  // On click or on change works
  $("#todos").on("change", ".todo_item input[type=checkbox]", function() {
    var listItem = $(this).parent();

    // if ($(this).is(":checked")) { // Alternative
    if (this.checked) { // If user checked
      listItem.addClass("todo_item_completed");
      $("#todos_completed").html(++itemsCompleted);
      $("#todos_left").html(getItemsLeft());
    }
    else { // If user unchecked
      if (listItem.hasClass("todo_item_completed")) {
        listItem.removeClass("todo_item_completed");
        $("#todos_completed").html(--itemsCompleted);
        $("#todos_left").html(getItemsLeft());
      }
    }
  });

  $("#saveTodos").click(function() {
    var todos = [];

    $("#todos .todo_item").each(function(index, element) {
      todos.push({
        index: index,
        title: $(this).text(),
        completed: $(this).find("input:checked").length > 0
      });
    });

    var jsonTodos = {
      "savedTodos": JSON.stringify(todos)
    };

    $.post("/save", jsonTodos);
  });
});
