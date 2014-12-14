$(function() {
  var itemsTotal = 0;
  var itemsCompleted = 0;

  function getItemsLeft() {
    return itemsTotal - itemsCompleted;
  }

  function addTodoItem(title, completed, objectId) {
    if (typeof completed === "boolean") {
      console.log("isCompleted = " + completed);
    }
    var todoItem = $("<li>", {
      class: "todo_item" + (completed.toString() === "true" ? " todo_item_completed" : ""),
      html: $("<input>", {
        type: "checkbox",
        checked: (completed.toString() === "true" ? "checked" : false)
      }),
      "data-object-id": objectId
    });
    

    var deleteButton = $("<button>", {
      type: "button",
      text: "X",
      click: function(e) {
        $.ajax({
          url: "/item/" + objectId,
          type: "DELETE",
          success: function(result) {
            console.log("Deleted todo item");

            var button = $(e.currentTarget);
            var parentLi = button.closest("li");

            if (parentLi.hasClass("todo_item_completed")) {
              itemsCompleted--;
            }
            itemsTotal--;

            $("#todos_left").html(getItemsLeft());
            $("#todos_completed").html(itemsCompleted);

            parentLi.remove(); // Remove the todo item from the DOM
          }
        });
      } // end click
    });

    todoItem.append(title).append(deleteButton);
    return todoItem;
  }

  // Load saved data onto the page
  $.get("/items", function(todos) {
    todos.forEach(function(item) {
      $("#todos").append(addTodoItem(item.title, item.completed, item._id));

      if (item.completed.toString() === "true") {
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

      var todoItem = {
        index: itemsTotal,
        title: todoText,
        completed: "false"
      };

      var post_data = {
        new_item: todoItem
      };

      $.post("/item", post_data, function(objectId) {
        $("#todos").append(addTodoItem(todoText, "false", objectId));
        itemsTotal++;
        $("#todos_left").html(getItemsLeft());
      });
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

      $.ajax({
        url: "/item",
        type: "PUT",
        data: {
          _id: listItem.data("object-id"),
          completed: "true"
        },
        success: function(result) {
          console.log("Set todo item to completed");
        }
      });
    }
    else { // If user unchecked
      if (listItem.hasClass("todo_item_completed")) {
        listItem.removeClass("todo_item_completed");
        $("#todos_completed").html(--itemsCompleted);
        $("#todos_left").html(getItemsLeft());

        $.ajax({
          url: "/item",
          type: "PUT",
          data: {
            _id: listItem.data("object-id"),
            completed: "false"
          },
          success: function(result) {
            console.log("Set todo item to incomplete");
          }
        });
      }
    }
  });

  $("#clearCompletedTodos").click(function() {
    $("#todos .todo_item").each(function(index, element) {
      if ($(this).hasClass("todo_item_completed")) {
        var listItem = $(this);
        
        $.ajax({
          url: "/item/" + listItem.data("object-id"),
          type: "DELETE",
          success: function(result) {
            itemsCompleted--;
            itemsTotal--;            

            $("#todos_left").html(getItemsLeft());
            $("#todos_completed").html(itemsCompleted);

            listItem.remove(); // Remove the todo item from the DOM
          }
        });
      } // End if hasClass
    });
  });
});
