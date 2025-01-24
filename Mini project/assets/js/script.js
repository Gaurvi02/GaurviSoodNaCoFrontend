document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list");
    const completeList = document.getElementById("complete-list");
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const removeButton = document.getElementById("remove-button");
    const moveToComplete = document.getElementById("move-to-complete");
    const moveToTodo = document.getElementById("move-to-todo");
    const toasterContainer = document.getElementById("toaster-container");

    let undoStack = [];


    // Function to update button text based on screen width
    function updateButtonLabels() {
        if (window.innerWidth <= 768) {
            moveToComplete.textContent = "MOVE DOWN";
            moveToTodo.textContent = "MOVE UP";
        } else {
            moveToComplete.textContent = "MOVE TO RIGHT →";
            moveToTodo.textContent = "← MOVE TO LEFT";
        }
    }

      // Listen for window resize events
      window.addEventListener("resize", updateButtonLabels);

      // Set the labels on page load
      updateButtonLabels();

    // Display toaster notifications
    function showToaster(message, undoCallback = null) {
        const toaster = document.createElement("div");
        toaster.className = "toaster";
        toaster.innerHTML = `
            <span>${message}</span>
            ${undoCallback ? '<button id="undo-button">UNDO</button>' : ''}
        `;
        toasterContainer.appendChild(toaster);

        // Remove toaster after 5 seconds
        setTimeout(() => {
            if (toasterContainer.contains(toaster)) {
                toaster.remove();
            }
        }, 5000);

        // Handle undo
        if (undoCallback) {
            toaster.querySelector("#undo-button").addEventListener("click", () => {
                undoCallback();
                toaster.remove();
            });
        }
    }

    // Add task to a list
    function addTaskToList(task, list) {
        if (Array.from(list.children).some(item => item.textContent === task.text)) {
            showToaster("Task already exists!");
            return;
        }
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.selected) li.classList.add("selected");
        li.addEventListener("click", () => li.classList.toggle("selected"));
        list.appendChild(li);
        saveTasks(); // Save changes to localStorage
    }

    // Add new task
    addButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        addTaskToList({ text: taskText, selected: false }, todoList);
        taskInput.value = "";
        showToaster("Task added to To-Do List");
    });

    // Remove selected tasks
    removeButton.addEventListener("click", () => {
        const removedTasks = [];
        [todoList, completeList].forEach(list => {
            Array.from(list.children)
                .filter(task => task.classList.contains("selected"))
                .forEach(task => {
                    removedTasks.push({ text: task.textContent, parent: list });
                    task.remove();
                });
        });

        if (removedTasks.length) {
            undoStack = [...removedTasks];
            showToaster("Tasks removed!", () => {
                undoStack.forEach(({ text, parent }) => addTaskToList({ text }, parent));
                undoStack = [];
            });
        }
        saveTasks(); // Save changes to localStorage
    });

    // Move tasks between lists
    function moveTasks(source, target, message) {
        Array.from(source.children)
            .filter(task => task.classList.contains("selected"))
            .forEach(task => {
                task.classList.remove("selected");
                target.appendChild(task);
            });
        showToaster(message);
        saveTasks(); // Save changes to localStorage
    }

    moveToComplete.addEventListener("click", () =>
        moveTasks(todoList, completeList, "Tasks moved to Complete List")
    );

    moveToTodo.addEventListener("click", () =>
        moveTasks(completeList, todoList, "Tasks moved to To-Do List")
    );

    // Load tasks from localStorage
    function loadTasks() {
        const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
        const completeTasks = JSON.parse(localStorage.getItem("completeTasks")) || [];

        // Populate lists
        todoTasks.forEach(task => addTaskToList(task, todoList));
        completeTasks.forEach(task => addTaskToList(task, completeList));
    }

    // Save tasks to localStorage
    function saveTasks() {
        const todoTasks = Array.from(todoList.children).map(task => ({
            text: task.textContent,
            selected: task.classList.contains("selected"),
        }));
        const completeTasks = Array.from(completeList.children).map(task => ({
            text: task.textContent,
            selected: task.classList.contains("selected"),
        }));

        localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
        localStorage.setItem("completeTasks", JSON.stringify(completeTasks));
    }

    // Initialize tasks
    loadTasks();
});
