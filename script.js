let newTask = document.querySelector(".new-task");
let todoItemList = document.querySelector(".todo-item-list");
let todosActions = document.querySelector(".todos__actions");

let countItems = document.querySelector(".count");

let completeAllTasks = document.querySelector(".complete-all");
let allTasks = document.querySelector(".all-tasks");
let activeTasks = document.querySelector(".filter-active");
let completedTasks = document.querySelector(".filter-completed");
let clearBtn = document.querySelector(".clear");

// Функция добавления новой задачи
function addTaskToList(value) {
  if (!value) {
    return false;
  }

  // console.log(value);

  let todoList = document.querySelector(".todo-item-list");
  let li = document.createElement("li");
  let div = document.createElement("div");
  let checkbox = document.createElement("input");
  let label = document.createElement("label");
  let button = document.createElement("button");

  checkbox.setAttribute("type", "checkbox");
  div.className = "task";
  li.className = "active";

  label.innerHTML = value;
  button.innerHTML = `\&#x2716;`;
  button.className = "delete-btn";

  button.addEventListener("click", handleDeleteButtonClick);

  todoList.prepend(li);
  li.appendChild(div);
  div.appendChild(checkbox);
  div.appendChild(label);
  div.appendChild(button);

  if (completedTasks.classList.contains("selected")) {
    li.style.display = "none";
  }

  updateItemsLeftCount();
}

// Функция для получения списка задач
function getItemArray() {
  return Array.from(todoItemList.children);
}

// Функция удаления задачи
function handleDeleteButtonClick(event) {
  let li = event.target.closest("li");
  li.remove();

  updateItemsLeftCount();
}

// Функция пересчета количества активных задач
function updateItemsLeftCount() {
  let activeItemsCount = getItemArray().filter((task) =>
    task.classList.contains("active")
  ).length;

  countItems.textContent = `${activeItemsCount} items left`;
}

// Функция для отображения .items-clear
function updateClearButtonVisibility() {
  let completedItems = getItemArray().filter((task) =>
    task.classList.contains("completed")
  );

  if (completedItems.length > 0) {
    clearBtn.style.display = "block";
  } else {
    clearBtn.style.display = "none";
  }
}

//Функция добавления класса к выбранному фильтру
function updateFilterSelection(selectedFilter) {
  let filters = document.querySelectorAll(".filter__list li");
  filters.forEach((filter) => filter.classList.remove("selected"));

  selectedFilter.classList.add("selected");
}

// Функция обновления видимости задач в соответствии с активным фильтром
function updateTaskVisibility() {
  let itemArray = getItemArray();

  if (allTasks.classList.contains("selected")) {
    itemArray.forEach((task) => (task.style.display = "block"));
  } else if (activeTasks.classList.contains("selected")) {
    itemArray.forEach((task) => {
      task.style.display = task.classList.contains("active") ? "block" : "none";
    });
  } else if (completedTasks.classList.contains("selected")) {
    itemArray.forEach((task) => {
      task.style.display = task.classList.contains("completed") ? "block" : "none";
    });
  }
}

// Создание задачи по кнопке Enter
newTask.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTaskToList(newTask.value);
    updateClearButtonVisibility();
    newTask.value = "";
    todosActions.style.display = "flex";
  }
});

// Отмечаем задачу как активную/завершенную
todoItemList.addEventListener("click", function (event) {
  if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
    let clickedItem = event.target.closest("li");
    clickedItem.classList.toggle("active");
    clickedItem.classList.toggle("completed");

    updateItemsLeftCount();
    updateClearButtonVisibility();
  }
});

// Завершить все задачи
completeAllTasks.addEventListener("click", function () {
  let itemArray = getItemArray();

  const hasCompleted = itemArray.some((task) =>
    task.classList.contains("completed")
  );
  const hasActive = itemArray.some((task) => task.classList.contains("active"));

  if ((hasCompleted && hasActive) || hasActive) {
    itemArray.forEach((task) => {
      task.classList.add("completed");
      task.classList.remove("active");

      let checkbox = task.querySelector('input[type="checkbox"]');
      checkbox.checked = true;
    });
  } else if (hasCompleted) {
    itemArray.forEach((task) => {
      task.classList.remove("completed");
      task.classList.add("active");

      let checkbox = task.querySelector('input[type="checkbox"]');
      checkbox.checked = false;
    });
  }

  updateItemsLeftCount();
  updateClearButtonVisibility();
  updateTaskVisibility();
});

// Фильтр для отображения всех задач
allTasks.addEventListener("click", function () {
  let itemArray = getItemArray();
  itemArray.forEach((task) => (task.style.display = "block"));
  updateFilterSelection(allTasks);
});

// Фильтр для отображения только активных задач
activeTasks.addEventListener("click", function () {
  let itemArray = getItemArray();
  let activeItems = itemArray.filter((task) =>
    task.classList.contains("active")
  );
  itemArray.forEach((task) => (task.style.display = "none"));
  activeItems.forEach((task) => (task.style.display = "block"));

  updateFilterSelection(activeTasks);
});

// Фильтр для отображения только завершенных задач
completedTasks.addEventListener("click", function () {
  let itemArray = getItemArray();
  let completedItems = itemArray.filter((task) =>
    task.classList.contains("completed")
  );
  itemArray.forEach((task) => (task.style.display = "none"));
  completedItems.forEach((task) => (task.style.display = "block"));

  updateFilterSelection(completedTasks);
});

// Кнопка удалить все завершенные задачи
clearBtn.addEventListener("click", function () {
  let completedItems = getItemArray().filter((task) =>
    task.classList.contains("completed")
  );
  completedItems.forEach((task) => task.remove());

  updateItemsLeftCount();
  updateClearButtonVisibility();
  updateFilterSelection(allTasks);
  updateTaskVisibility();

  let itemArray = getItemArray();
  if (itemArray.length == 0) {
    todosActions.style.display = "none";
  }
});

// Переименовать задачу по двойному нажатию на название
todoItemList.addEventListener("dblclick", function(event) {
  if (event.target.tagName === "LABEL") {
    let label = event.target;
    let originalText = label.textContent;
    let li = label.closest("li");
    let div = label.parentNode;

    label.contentEditable = 'true';  
    label.className = "edit-input";
    label.focus();                   
    
    // Обработчик для завершения редактирования по нажатию Enter и Esc
    label.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        label.contentEditable = 'false';  
      } else if (event.key === "Escape") {
        label.textContent = originalText; 
        label.contentEditable = 'false';  
        event.preventDefault();
      }
    });

    // HОбработчик для завершения редактирования по потере фокуса
    label.addEventListener("blur", function() {
      label.contentEditable = 'false';  
    });
  }
});