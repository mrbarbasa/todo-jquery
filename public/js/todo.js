$(function() {
  var itemsTotal = 0;
  var itemsCompleted = 0;

  function getItemsLeft() {
    return itemsTotal - itemsCompleted;
  }

  function addTodoItem(title, completed) {
    var todoItem = $("<li>", {
      class: "todo_item" + (completed ? " todo_item_completed" : ""),
      html: $("<input>", {
        type: "checkbox",
        checked: completed
      })
    });
    todoItem.append(title);
    return todoItem;
  }

  // Load saved data onto the page
  $.get("/todo_save.txt", function(data) {
    var todos = $.parseJSON(data);

    todos.forEach(function(item) {
      $("#todos").append(addTodoItem(item.title, item.completed));

      if (item.completed) {
        itemsCompleted++;
      }
      itemsTotal++;
    });

    $("#todos_left").html(getItemsLeft());
    $("#todos_completed").html(itemsCompleted);
  });

  $("#todo_input").keypress(function(e) {
    if (e.which === 13) { // When Enter key is pressed, process the input
      var input = $(this);
      var todoText = input.val(); // Save the value before clearing it
      input.val(""); // Clear out the text after Enter is pressed

      $("#todos").append(addTodoItem(todoText, false));
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

  $("#clearCompletedTodos").click(function() {
    $("#todos .todo_item").each(function(index, element) {
      if ($(this).hasClass("todo_item_completed")) {
        $(this).remove();
      }
    });
  });
});
