class Task {
    constructor(name) {
        this.name = name;
        this.isCompleted = false;
    }

    complete() {
        this.isCompleted = true;
    }
}
// localStorage.clear()
const textfield = document.getElementById('textfield');
const addBtn = document.getElementById("add-btn");
const filterSelect = document.getElementById("filter-select");
const todoListDiv = document.getElementById("todolist");

let todoList = [];
let viewMode = "all";

loadData();

addBtn.addEventListener("click", addTask);
filterSelect.addEventListener("click", filterTasks);

function loadData() {
    if (localStorage.getItem("data") !== null) {
        let data = JSON.parse(localStorage.getItem("data"));
        
        loadTasks(data.taskArr);
        loadViewMode(data.viewMode);
        
    }
}

function loadTasks(taskArr) {

    taskArr.forEach(taskJson => {
        let task = new Task(taskJson.name);
        todoList.push(task);

        let taskDiv = createTaskDiv(task);
        todoListDiv.appendChild(taskDiv);

        if (taskJson.isCompleted) {
            task.complete();
            taskDiv.classList.add("completed-task");
        }
    });
}


function loadViewMode(viewMode) {

    for (let i = 0; i < filterSelect.length; i++) {
        if (filterSelect.options[i].value === viewMode) {
            filterSelect.options[i].selected =true;
            break;
        }
    }

    filterTasks();
}
function addTask(e) {
    e.preventDefault();
    if (textfield.value.trim().length > 0) {
        let task = new Task(textfield.value);
        todoList.push(task);
        
        let taskDiv = createTaskDiv(task);
        todoListDiv.appendChild(taskDiv);

        saveChange();
        setDisplayBasedOnViewMode(taskDiv);
        textfield.value = "";
    }
}

function createTaskDiv(task) {
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    let pName = document.createElement("p");
    pName.innerText = task.name;
    pName.classList.add("task-name");

    let completeBtn = document.createElement("button");
    completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", () => {
        task.complete();
        taskDiv.classList.add("completed-task");
        saveChange();
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        taskDiv.classList.add("disappearing");
        setTimeout(() => {
            console.log('before: ' + todoList.length);
            todoList.splice(todoList.indexOf(task), 1);
            todoListDiv.removeChild(taskDiv);
            console.log("deleted");
            console.log("after: " + todoList.length);
            saveChange();
        }, 1000);
    });

    taskDiv.appendChild(pName);
    taskDiv.appendChild(completeBtn);
    taskDiv.appendChild(deleteBtn);

    return taskDiv;
}

function saveChange() {
    let data = {viewMode: viewMode, taskArr: todoList};
    localStorage.setItem("data", JSON.stringify(data));
    
}

function setDisplayBasedOnViewMode(newTaskDiv) {
    // a newly created task is uncompleted task,
    // if the viewMode is set to display only completed tasks,
    // then the newly created task will be hidden

    if (viewMode === "completed") {
        newTaskDiv.style.display = "none";
    }
}

function filterTasks() {
    switch (filterSelect.value) {
        case "all": 
            viewMode = "all";
            displayAllTasks();
            break;
        case "completed": 
            viewMode = "completed";
            displayCompletedTasks();
            break;
        case "uncompleted": 
            viewMode = "uncompleted";
            displayUncompletedTasks();
            break;
    }

    saveChange();
}

function displayAllTasks() {

    todoListDiv.childNodes.forEach(taskDiv => {
        taskDiv.style.display = "grid";
    })
}

function displayCompletedTasks() {
    todoListDiv.childNodes.forEach(taskDiv => {
        if (taskDiv.classList.contains("completed-task")) {
            taskDiv.style.display = "grid";
        } else {
            taskDiv.style.display = "none";
        }
    })
}

function displayUncompletedTasks() {
    todoListDiv.childNodes.forEach(taskDiv => {
        if (taskDiv.classList.contains("completed-task")) {
            taskDiv.style.display = "none";
        } else {
            taskDiv.style.display = "grid";
        }
    })
}