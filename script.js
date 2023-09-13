const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");
const addTaskButton = document.getElementById("addTaskBn");
const taskList = document.getElementById("taskList");

// Add event listeners for add task button
addTaskButton.addEventListener("click", addTaskBn);

// Function to add a new task
function addTaskBn() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categoryInput.value;

  // Check if all fields are filled
  if (taskText !== "" && dueDate !== "" && category !== "") {
    if (isTaskNameExists(taskText)) {
      alert(`A task with the name "${taskText}" and due date "${dueDate}" is already present.`);
      return; 
    }
    if (!isValidDueDate(dueDate)) {
      alert("Please enter a due date in the future.");
      return;
    }
    const task = {
      text: taskText,
      dueDate: dueDate,
      category: category,
      status: "Pending",
    };

    saveTaskToLocalStorage(task);
    loadAndDisplaySortedTasks();

    // Clear input fields
    taskInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "";
  }
}

// Function to check if the due date is in the future
function isValidDueDate(dueDate) {
  const now = new Date();
  const selectedDueDate = new Date(dueDate);

  return selectedDueDate > now;
}

// Get the sorting buttons
const sortDueDateButton = document.getElementById("sortDueDate");
const sortCompletionStatusButton = document.getElementById("sortCompletionStatus");
const sortCategoryButton = document.getElementById("sortCategory");

// Add event listeners for sorting buttons
sortDueDateButton.addEventListener("click", () => {
  sortTasksByDueDate();
});

sortCompletionStatusButton.addEventListener("click", () => {
  sortTasksByCompletionStatus();
});

sortCategoryButton.addEventListener("click", () => {
  sortTasksByCategory();
});

// Sorting functions
function sortTasksByDueDate() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadAndDisplaySortedTasks();
}

function sortTasksByCompletionStatus() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => a.status.localeCompare(b.status));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadAndDisplaySortedTasks();
}

function sortTasksByCategory() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => a.category.localeCompare(b.category));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadAndDisplaySortedTasks();
}

// Get the search input
const searchInput = document.getElementById("searchInput");

// Add event listener for search input
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  searchTasks(searchTerm);
});

// Search function
function searchTasks(searchTerm) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter(task => {
    return (
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  taskList.innerHTML = ""; 
  filteredTasks.forEach(task => {
    displayTask(task);
  });
}

// Get the filter options and apply filters button
const completionFilter = document.getElementById("completionFilter");
const categoryFilter = document.getElementById("categoryFilter");
const applyFiltersButton = document.getElementById("applyFilters");

// Add event listener for apply filters button
applyFiltersButton.addEventListener("click", applyFilters);

// Apply filters function
function applyFilters() {
  const selectedCompletionStatus = completionFilter.value;
  const selectedCategory = categoryFilter.value;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let filteredTasks = tasks;

  if (selectedCompletionStatus !== "all") {
    filteredTasks = filteredTasks.filter(task => task.status === selectedCompletionStatus);
  }

  if (selectedCategory !== "all") {
    filteredTasks = filteredTasks.filter(task => task.category === selectedCategory);
  }

  taskList.innerHTML = ""; // Clear the current display

  filteredTasks.forEach(task => {
    displayTask(task);
  });
}
// Function to check if a task name already exists
function isTaskNameExists(taskName) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks.some(task => task.text === taskName);
}

function loadAndDisplaySortedTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Separate tasks into "Complete" and "Incomplete" arrays
  const incompleteTasks = tasks.filter(task => task.status !== "Complete");
  const completeTasks = tasks.filter(task => task.status === "Complete");

  // Sort "Incomplete" tasks by due dates
  incompleteTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  taskList.innerHTML = ""; 

  // Display "Incomplete" tasks first
  incompleteTasks.forEach(task => {
    displayTask(task);
  });

  // Display "Complete" tasks at the end
  completeTasks.forEach(task => {
    displayTask(task);
  });
}
// function to save data in local storage
function saveTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isPastDue(dueDate) {
  const now = new Date();
  return new Date(dueDate) < now;
}
// update task
function updateTask(task, newTaskText, newDueDate, newCategory) {
  task.text = newTaskText;
  task.dueDate = newDueDate;
  task.category = newCategory;
  updateTaskInLocalStorage(task);
}

// function to display flash card
function displayTask(task) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  if (task.status === "Complete") {
    taskCard.classList.add("completed-task");
  }else if (isPastDue(task.dueDate) && task.status === "Pending") {
    taskCard.classList.add("past-due-task");
  }

  const taskHeader = document.createElement("h3");
  taskHeader.textContent = task.text;

  const dueDateElement = document.createElement("p");
  dueDateElement.classList.add("due-date");
  dueDateElement.textContent = `Due: ${task.dueDate}`;

  const categoryElement = document.createElement("p");
  categoryElement.classList.add("category");
  categoryElement.textContent = `Category: ${task.category}`;

  const statusElement = document.createElement("p");
  statusElement.classList.add("status");
  statusElement.textContent = `Status: ${task.status}`;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    showEditDialog(task, taskHeader, dueDateElement, categoryElement, statusElement);
  });

  // complete button in flash card (event listener)
  const completeButton = document.createElement("button");
  completeButton.textContent = "Complete";
  completeButton.addEventListener("click", () => {
    if (task.status !== "Complete") {
      taskCard.classList.toggle("completed-task");
      task.status = "Complete";
      updateTaskInLocalStorage(task);
      statusElement.textContent = `Status: ${task.status}`;

      taskList.removeChild(taskCard);
      taskList.appendChild(taskCard);
    }
  });

  // delete button in flash card(event listener)
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    taskList.removeChild(taskCard);
    removeTaskFromLocalStorage(task);
  });

  taskCard.appendChild(taskHeader);
  taskCard.appendChild(dueDateElement);
  taskCard.appendChild(categoryElement);
  taskCard.appendChild(statusElement);
  taskCard.appendChild(editButton);
  taskCard.appendChild(completeButton);
  taskCard.appendChild(deleteButton);

  taskList.appendChild(taskCard);
}


// function of dialog box of edit button
function showEditDialog(task, taskHeader, dueDateElement, categoryElement, statusElement) {
  const dialog = document.createElement("div");
  dialog.classList.add("edit-dialog");

  const taskInput = createInputElement("Task: ", task.text);
  const dueDateInput = createDueDateInput("Due Date: ", task.dueDate);
  const categorySelect = createCategorySelectElement("Category: ", task.category);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const newTaskText = taskInput.querySelector("input").value.trim();
    const newDueDate = dueDateInput.querySelector("input").value;
    const newCategory = categorySelect.querySelector("select").value;
    if (newTaskText !== "" && newDueDate !== "" && newCategory !== "") {
      // Update the task's data
            updateTask(task, newTaskText, newDueDate, newCategory);

      // Update the task display on the page
      updateTaskDisplay(task, taskHeader, dueDateElement, categoryElement, statusElement);

      // Update the task in local storage
      updateTaskInLocalStorage(task);
      dialog.remove();
    }
  });
  // cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    dialog.remove(); // Use the remove() method to remove the dialog element
  });

  dialog.appendChild(taskInput);
  dialog.appendChild(dueDateInput);
  dialog.appendChild(categorySelect);
  dialog.appendChild(saveButton);
  dialog.appendChild(cancelButton);

  document.body.appendChild(dialog);
}
// update the task card (call in edit dialog box )
function updateTaskDisplay(task, taskHeader, dueDateElement, categoryElement, statusElement) {
  taskHeader.textContent = task.text;
  dueDateElement.textContent = `Due: ${task.dueDate}`;
  categoryElement.textContent = `Category: ${task.category}`;
  statusElement.textContent = `Status: ${task.status}`;
}
// function call in edit dialog box
function createDueDateInput(label, value) {
  const container = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  const inputElement = document.createElement("input");
  inputElement.type = "date";
  inputElement.value = value;
  container.appendChild(labelElement);
  container.appendChild(inputElement);
  return container;
}
// function call in edit dialog box
function createInputElement(label, value) {
  const container = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  const inputElement = document.createElement("input");
  inputElement.value = value;
  container.appendChild(labelElement);
  container.appendChild(inputElement);
  return container;
}
// function call in edit dialog box
function createCategorySelectElement(label, selectedCategory) {
  const container = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  const selectElement = document.createElement("select");

  // Add your category options here
  const categories = ["Work", "Personal", "Sports", "Shopping"];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selectedCategory) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });

  container.appendChild(labelElement);
  container.appendChild(selectElement);
  return container;
}



// update task in local storage
function updateTaskInLocalStorage(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const index = tasks.findIndex(
    task => task.text === updatedTask.text && task.dueDate === updatedTask.dueDate
  );

  if (index !== -1) {
    tasks[index] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadAndDisplaySortedTasks();
    console.log("Task updated in local storage.");
  } else {
    console.log("Task not found in local storage.");
  }
}

// Function to remove a task from local storage
function removeTaskFromLocalStorage(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskToRemove.text || task.dueDate !== taskToRemove.dueDate);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage when the page loads
window.addEventListener("load", loadTasks);
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    displayTask(task);
  });
}

// search icon  
const searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener('click', () => {
  searchInput.toggleAttribute('hidden');
  searchInput.classList.toggle('active'); 
  if (!searchInput.hasAttribute('hidden')) {
    searchInput.focus(); 
  }
});
// clock javascript
function updateClockHands() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourHand = document.getElementById("hourHand");
  const minuteHand = document.getElementById("minuteHand");
  const secondHand = document.getElementById("secondHand");

  const hourDeg = hours * 30 + minutes * 0.5; // 30 degrees per hour, plus additional angle due to minutes
  const minuteDeg = minutes * 6; // 6 degrees per minute
  const secondDeg = seconds * 6; // 6 degrees per second

  hourHand.style.transform = `rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `rotate(${secondDeg}deg)`;
}
// Update the clock hands every second
setInterval(updateClockHands, 1000);
// Call the updateClockHands function initially to set the initial position
updateClockHands();


// Get the voice search button
const voiceSearchButton = document.getElementById('voiceSearchButton');

// Add event listener to the voice search button
voiceSearchButton.addEventListener('click',() => {
  searchInput.toggleAttribute('hidden');
  searchInput.classList.toggle('active'); 
  startVoiceRecognition();
   if (!searchInput.hasAttribute('hidden')) {
    searchInput.focus(); 
  }
});
// Function to start voice recognition
function startVoiceRecognition() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  
  recognition.lang = 'en-IND'; // Set the recognition language
  recognition.start(); // Start recognition
  
  // Event listener for recognition result
  recognition.onresult = async event => {
    const result = event.results[0][0].transcript; // Get the recognized text
    searchInput.value = result; // Set the translated text to the search input
    searchTasks(result); // Perform the search based on translated text
    recognition.stop(); // Stop recognition
  };
  
  // Event listener for recognition error
  recognition.onerror = event => {
    console.error('Voice recognition error:', event.error);
    recognition.stop(); // Stop recognition on error
  };
}


