import {
  USERS,
  createInitialState,
  addCategory,
  addTask,
  toggleTask,
  visibleTasks,
} from "./taskCore.js";

const STORAGE_KEY = "easy-task-app-state";

function loadState() {
  // プロジェクトを初めて触る人向け:
  // localStorageは「このブラウザ内だけに保存するメモ帳」です。
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createInitialState();

  try {
    return JSON.parse(raw);
  } catch {
    return createInitialState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let activeUser = "you";

const activeUserEl = document.getElementById("activeUser");
const newCategoryNameEl = document.getElementById("newCategoryName");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryTabsEl = document.getElementById("categoryTabs");
const taskTitleEl = document.getElementById("taskTitle");
const taskVisibilityEl = document.getElementById("taskVisibility");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("taskList");

function renderTabs() {
  categoryTabsEl.innerHTML = "";

  state.categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.className = `tab ${state.activeCategoryId === category.id ? "active" : ""}`;
    btn.addEventListener("click", () => {
      state = { ...state, activeCategoryId: category.id };
      saveState(state);
      render();
    });
    categoryTabsEl.appendChild(btn);
  });
}

function renderTasks() {
  taskListEl.innerHTML = "";
  // ここで「現在の利用者が見えるタスクだけ」を絞り込みます。
  const items = visibleTasks(state, activeUser, state.activeCategoryId);

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.textContent = "このタブに表示できるタスクはまだありません。";
    taskListEl.appendChild(li);
    return;
  }

  items.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      state = toggleTask(state, task.id);
      saveState(state);
      render();
    });

    const title = document.createElement("strong");
    title.textContent = task.title;

    const meta = document.createElement("p");
    meta.className = "meta";
    const ownerLabel = USERS[task.owner] ?? task.owner;
    const visibilityLabel = task.visibility === "shared" ? "共有" : "自分のみ";
    meta.textContent = `作成者: ${ownerLabel} / 公開: ${visibilityLabel} / 状態: ${task.completed ? "完了" : "未完了"}`;

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(title);
    li.appendChild(meta);
    taskListEl.appendChild(li);
  });
}

function render() {
  activeUserEl.value = activeUser;
  renderTabs();
  renderTasks();
}

activeUserEl.addEventListener("change", (e) => {
  activeUser = e.target.value;
  render();
});

addCategoryBtn.addEventListener("click", () => {
  state = addCategory(state, newCategoryNameEl.value);
  newCategoryNameEl.value = "";
  saveState(state);
  render();
});

addTaskBtn.addEventListener("click", () => {
  state = addTask(state, {
    title: taskTitleEl.value,
    owner: activeUser,
    categoryId: state.activeCategoryId,
    visibility: taskVisibilityEl.value,
  });
  taskTitleEl.value = "";
  saveState(state);
  render();
});

render();
