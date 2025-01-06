import { createStore } from "redux";
import taskReducer from "./taskReducer";
import {
  addTask,
  removeTask,
  toggleTask,
  calculateTotalTasks,
} from "./actions";

const store = createStore(taskReducer);

store.subscribe(() => {
  renderTasks();
  updateTotalTasks();
});

function renderTasks() {
  const state = store.getState();
  const taskList = document.getElementById("task-list");
  if (!taskList) return;

  taskList.innerHTML = "";

  const unorderedList = document.createElement("ul");

  state.tasks.forEach((task) => {
    const taskItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskStatus(task.id));

    const taskText = document.createTextNode(
      ` ${task.id}. ${task.text}: ${task.labels}${
        task.completed ? ": Completed" : ""
      }`
    );

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);

    unorderedList.appendChild(taskItem);
  });

  taskList.appendChild(unorderedList);
}

function updateTotalTasks() {
  const state = store.getState();
  const totalTasksElement = document.getElementById("total-tasks");
  if (totalTasksElement) {
    totalTasksElement.textContent = `Total Tasks: ${state.totalTasks}`;
  }
}

function handleAddTask(event) {
  event.preventDefault();

  const taskInput = document.getElementById("task-name");
  const labelInput = document.getElementById("task-description");

  if (!taskInput.value || !labelInput.value) return;

  const newTask = {
    id: store.getState().tasks.length + 1,
    text: taskInput.value,
    labels: labelInput.value,
    completed: false,
  };

  store.dispatch(addTask(newTask));

  taskInput.value = "";
  labelInput.value = "";
}

function handleRemoveTask(event) {
  event.preventDefault();

  const taskIdInput = document.getElementById("task-id");
  const taskId = parseInt(taskIdInput.value);

  if (isNaN(taskId)) return;

  store.dispatch(removeTask(taskId));
  taskIdInput.value = "";
}

function toggleTaskStatus(taskId) {
  store.dispatch(toggleTask(taskId));
}

document.addEventListener("DOMContentLoaded", () => {
  const addTaskForm = document.getElementById("add-task-form");
  const removeTaskForm = document.getElementById("remove-task-form");

  addTaskForm.addEventListener("submit", handleAddTask);
  removeTaskForm.addEventListener("submit", handleRemoveTask);

  renderTasks();
  updateTotalTasks();
});