
// =============== ELEMENT SELECTION ===============
let taskInput = document.getElementById("taskInput");      
let addBtn = document.getElementById("addBtn");           
let clrBtn = document.getElementById("clrBtn");           
let taskList = document.getElementById("taskList");        
let taskcount = document.getElementById("taskcount");      
let totalBtn = document.getElementById("totalBtn");        
let completedBtn = document.getElementById("completedBtn");
let pendingBtn = document.getElementById("pendingBtn");    
let chngTheamBtn = document.getElementById("chngTheam");   

let total = 0;      
let completed = 0;   
let editMode = null; 

// =============== PAGE RELOAD  ===============
window.addEventListener('DOMContentLoaded', loadData);

// =============== Add TASK  ===============
function addTask() {
    let newTask = taskInput.value.trim()

    if (newTask === "") {
        alert("Please Enter the task");
        return;
    }

    // editmode
    if (editMode) {
       editMode.querySelector("span").textContent = newTask; 
       editMode = null;
       addBtn.innerText = "Add";
       taskInput.value = "";
       return;
    }

    //create list
    let list = document.createElement('li');
    taskList.appendChild(list);

    //create checkbox
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox"
    list.appendChild(checkbox);

    //crete span in list
    let spanText = document.createElement('span');
    spanText.textContent = newTask;
    list.appendChild(spanText);

    //create edit button in list
    let editBtn = document.createElement('button');
    editBtn.innerText = "Edit";
    editBtn.className = "editBtn";
    list.appendChild(editBtn);

    //create Delete button in list
    let delBtn = document.createElement('button');
    delBtn.innerText = "Delete";
    delBtn.className = "delBtn";
    list.appendChild(delBtn);

    taskInput.value = "";   // input empty
    total++;
    updateCount();
    saveData();

    // Show rest Button
    clrBtn.style.display = "block"

    // checkbox event 
    checkbox.addEventListener('click', function(){
       if (checkbox.checked) {
        spanText.classList.add("completed");
        completed++;
       }
       else{
        spanText.classList.remove("completed");
        completed--;
       }
       updateCount();
       saveData()
    });

    // Edit event
    editBtn.addEventListener('click', function(){
        taskInput.value = spanText.textContent;
        addBtn.innerText = "update"
        taskInput.focus();
        editMode = list;
        saveData()
    });

    // Delete event
    delBtn.addEventListener('click', function(){
        if (checkbox.checked) 
         completed--;
        
         total--;
         taskList.removeChild(list);
         updateCount();
         saveData()
    });
};

// =============== Press Enter to Add Task  ===============
taskInput.addEventListener('keydown', function(e){
    if (e.key === "Enter") 
      addTask();
});

// =============== Filter Total | Compuleted | Pending   ===============
function setActiveFilter(button) {
    totalBtn.classList.remove("activeFilter");
    completedBtn.classList.remove("activeFilter");
    pendingBtn.classList.remove("activeFilter");

    button.classList.add("activeFilter");
};

// Event click All to show all list
totalBtn.addEventListener('click', function(){
   setActiveFilter(totalBtn);
   let allList = taskList.querySelectorAll('li');
   allList.forEach(li => {
    li.style.display = "flex";
   });
});

// Event click completed to show all completed
completedBtn.addEventListener('click', function(){
   setActiveFilter(completedBtn);
   let allCompleted = taskList.querySelectorAll('li');
   allCompleted.forEach( li => {
     li.style.display = li.querySelector("span").classList.contains("completed") ? "flex" : "none";
   });
});

// Event click pending to show all pending
pendingBtn.addEventListener('click', function(){
   setActiveFilter(pendingBtn);
   let allPending = taskList.querySelectorAll('li');
   allPending.forEach(li =>{
     li.style.display = li.querySelector("span").classList.contains("completed") ? "none" : "flex";
   });
});

// shortcut 1,2,3
document.addEventListener('keydown', function(e){
    if (e.key === "1")  totalBtn.click();
    if (e.key === "2")  completedBtn.click();
    if (e.key === "3")  pendingBtn.click();
});

// =============== Rest/Clear All DAta  ===============
function clrData(){
    if (confirm("Are You clear Data?")) {
        taskList.innerHTML = "";
        taskInput.value = "";
        clrBtn.style.display = "none";
        total = 0; 
        completed = 0;
        updateCount();
        saveData()
        localStorage.removeItem("To-Do-List");

    }
};

// Shortcut Ctrl + Delete   Reset / Clear all data
document.addEventListener('keydown', function(e){
   if (e.key === "Delete" && e.ctrlKey) {
    if (taskList.children.length > 0) {
      clrData();
    }
   }
})

// =============== Total | Compuleted | Pending  UpdateCount  ===============
function updateCount() {
   let pending = total - completed;
   totalBtn.textContent =  `Total: ${total}`
   completedBtn.textContent =  `Completed: ${completed}`
   pendingBtn.textContent =  `Pending: ${pending}`
};


addBtn.addEventListener('click', addTask);
clrBtn.addEventListener('click', clrData);

// =============== LOCAL STORAGE (SAVE / LOAD) ===============

function saveData(){
    let tasks = [];
    let allLi = document.querySelectorAll("#taskList li");
    allLi.forEach(li => {
        let span = li.querySelector("span");
        let checkbox= li.querySelector("input[type='checkbox']");
        tasks.push({
          text : span.textContent,
          checked: checkbox.checked
        });
    });
    localStorage.setItem("To-Do-List", JSON.stringify(tasks));
};

function loadData(){
   let savedData = localStorage.getItem("To-Do-List");
   if(savedData){
    clrBtn.style.display = "inline";

    let tasks = JSON.parse(savedData);
    
    tasks.forEach(task =>{
      let li = document.createElement('li');
      taskList.appendChild(li);

      let checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.checked = task.checked;
      li.appendChild(checkbox);
      let span = document.createElement('span');
      span.textContent = task.text;
      if(task.checked) span.classList.add('completed');
      li.appendChild(span);
      
      let editBtn = document.createElement('button');
      editBtn.innerText = "Edit";
      editBtn.className = "editBtn";
      li.appendChild(editBtn);

      let delBtn = document.createElement("button");
      delBtn.innerText = "Delete";
      delBtn.className = "delBtn";
      li.appendChild(delBtn);

      total++;
      if (task.checked) completed++;
      updateCount();

      // --- Events dubara lagao ---
      checkbox.addEventListener("click", function () {
        if (checkbox.checked) {
          span.classList.add("completed");
          completed++;
        } else {
          span.classList.remove("completed");
          completed--;
        }
        updateCount();
        saveData();
      });

      editBtn.addEventListener("click", function () {
        editMode = li;
        taskInput.value = span.textContent;
        taskInput.focus();
      });

      delBtn.addEventListener("click", function () {
        if (checkbox.checked) completed--;
        total--;
        taskList.removeChild(li);
        updateCount();
        saveData();
      });
    });
  }
}

// ===================== THEME CHANGE & SAVE =====================
//Save Theme
function toggleTheme() {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

chngTheamBtn.addEventListener("click", toggleTheme);

// ===================== LOAD THEME ON PAGE LOAD =====================
window.addEventListener("DOMContentLoaded", function() {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});



