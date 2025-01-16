//script.js
document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list");
    const completeList = document.getElementById("complete-list");
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const removeButton = document.getElementById("remove-button");
    const moveToComplete = document.getElementById("move-to-complete");
    const moveToTodo = document.getElementById("move-to-todo");

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
            selected: task.classList.contains("selected")
        }));
        const completeTasks = Array.from(completeList.children).map(task => ({
            text: task.textContent,
            selected: task.classList.contains("selected")
        }));

        localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
        localStorage.setItem("completeTasks", JSON.stringify(completeTasks));
    }

    // Add task to a list
    function addTaskToList(task, list) {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.selected) {
            li.classList.add("selected");
        }
        li.addEventListener("click", () => {
            li.classList.toggle("selected");
            saveTasks(); // Save changes
        });
        list.appendChild(li);
    }

    // Add new task to To-Do List
    addButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText === "") return; // Ignore empty input

        addTaskToList({ text: taskText, selected: false }, todoList);
        taskInput.value = ""; // Clear input
        saveTasks(); // Save changes
    });

    // Remove selected tasks from both lists
    removeButton.addEventListener("click", () => {
        const removeSelected = list => {
            Array.from(list.children)
                .filter(task => task.classList.contains("selected"))
                .forEach(task => task.remove());
        };

        removeSelected(todoList);
        removeSelected(completeList);
        saveTasks(); // Save changes
    });

    // Move selected tasks between lists
    moveToComplete.addEventListener("click", () => {
        Array.from(todoList.children)
            .filter(task => task.classList.contains("selected"))
            .forEach(task => {
                task.classList.remove("selected");
                completeList.appendChild(task);
            });
        saveTasks(); // Save changes
    });

    moveToTodo.addEventListener("click", () => {
        Array.from(completeList.children)
            .filter(task => task.classList.contains("selected"))
            .forEach(task => {
                task.classList.remove("selected");
                todoList.appendChild(task);
            });
        saveTasks(); // Save changes
    });

    // Responsive button text
    function updateButtonText() {
        if (window.innerWidth <= 768) {
            moveToComplete.textContent = "MOVE TO DOWN";
            moveToTodo.textContent = "MOVE TO UP";
        } else {
            moveToComplete.textContent = "MOVE TO RIGHT →";
            moveToTodo.textContent = "← MOVE TO LEFT";
        }
    }

    window.addEventListener("resize", updateButtonText);
    updateButtonText(); // Call on load

    // Initialize tasks
    loadTasks();
});
