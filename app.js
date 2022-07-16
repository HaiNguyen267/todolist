class Task {
    constructor(name, isCompleted) {
        this.name = name;
        this.isCompleted = isCompleted;
    }

    complete() {
        this.isCompleted = true;
    }
}   

const textfield = document.getElementById("textfield")
const addBtn = document.getElementById("add-btn")
const todolistDiv = document.getElementById("todolist")
const displayAllBtn = document.getElementById("display-all")
const displayCompletedBtn = document.getElementById("display-completed")
const displayUncompleteBtn = document.getElementById("display-uncompleted")
const prevThemeBtn = document.getElementById("previous")
const nextThemeBtn = document.getElementById("next")

addBtn.addEventListener("click", addTask);
displayAllBtn.addEventListener("click", displayAllTasks)
displayCompletedBtn.addEventListener("click", displayCompletedTasks)
displayUncompleteBtn.addEventListener("click", displayUncompletedTasks)
prevThemeBtn.addEventListener("click", changeToPreviousTheme)
nextThemeBtn.addEventListener("click", changeToNextTheme)

let themes = ["theme1", "theme2", "theme3", "theme4", "theme5", "theme6", "theme7"];
let themeIndex = 1;

let todolist = [];

loadData();

function loadData() {

    let data = localStorage.getItem("data")

    if (data != null) {
        let json = JSON.parse(data)
        loadTasks(json.taskArr)
        
        themeIndex = json.themeIndex
        loadTheme();
    }
}

function loadTasks(taskArr) {
    taskArr.forEach(taskJson => {
        let task = new Task(taskJson.name, taskJson.isCompleted)
        todolist.push(task)

        let taskDiv = createTaskDiv(task)
        todolistDiv.appendChild(taskDiv)
    })
}

function loadTheme() {
    document.body.className = themes[themeIndex]
}   

function addTask(e) {
    e.preventDefault();

    if (textfield.value.length != 0) {
        let task = new Task(textfield.value, false);
        todolist.push(task);

        let taskDiv = createTaskDiv(task);
        todolistDiv.appendChild(taskDiv);

        textfield.value = "";
        saveChange()
    }   
}

function createTaskDiv(task) {
    let taskDiv = document.createElement("div")
    taskDiv.classList.add("task")
    if (task.isCompleted) {
        taskDiv.classList.add("completed-task")
    }
    
    let taskName = document.createElement("p")
    taskName.classList.add("task-name")
    taskName.textContent = task.name;

    let completeBtn = document.createElement("button")
    completeBtn.classList.add("complete-btn")
    completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeBtn.addEventListener("click", () => {
        task.complete()
        taskDiv.classList.add("completed-task");

        saveChange();
    })

    let deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => {
        taskDiv.classList.add("deleted-task")
        setTimeout(() => {
            let index = todolist.indexOf(task)
            todolist.splice(index, 1)
            todolistDiv.removeChild(taskDiv)

            saveChange();
        }, 500)
    })
        
    taskDiv.appendChild(taskName)
    taskDiv.appendChild(completeBtn)
    taskDiv.appendChild(deleteBtn)

    return taskDiv
}

function saveChange() {
    console.log('themeindex: ' + themeIndex);
    let data = {themeIndex: themeIndex, taskArr: todolist}
    console.log("what i'll save: " + JSON.stringify(data));
    localStorage.setItem("data", JSON.stringify(data))
}

function displayAllTasks() {
    todolistDiv.childNodes.forEach(taskDiv => {
        taskDiv.style.display = "grid"
    })

    markBtnAsChecked(displayAllBtn)
}

function displayCompletedTasks() {
    todolistDiv.childNodes.forEach(taskDiv => {
        if (taskDiv.classList.contains('completed-task')) {
            taskDiv.style.display = 'grid'
        } else {
            taskDiv.style.display = 'none'
        }
    })

    markBtnAsChecked(displayCompletedBtn)
}

function displayUncompletedTasks() {
    todolistDiv.childNodes.forEach(taskDiv => {
        if (taskDiv.classList.contains('completed-task')) {
            taskDiv.style.display = 'none'
        } else {
            taskDiv.style.display = 'grid'
        }
    })

    markBtnAsChecked(displayUncompleteBtn)
}

function markBtnAsChecked(displayBtn) {
    let btns = [displayAllBtn, displayCompletedBtn, displayUncompleteBtn];

    btns.forEach(btn => {
        if (btn === displayBtn) {
            btn.classList.add("checked-btn")
        } else {
            btn.classList.remove("checked-btn")
        }
    })
}

function changeToPreviousTheme() {
    themeIndex --;

    if (themeIndex < 0) {
        themeIndex = themes.length - 1;
    }

    loadTheme()
    saveChange()
}

function changeToNextTheme() {
    themeIndex ++;

    if (themeIndex >= themes.length) {
        themeIndex = 0;
    }

    loadTheme()
    saveChange()
}

