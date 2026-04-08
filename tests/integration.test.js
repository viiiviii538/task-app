import assert from "node:assert/strict";
import { createInitialState, addTask, visibleTasks, toggleTask } from "../taskCore.js";

let state = createInitialState();
const categoryId = state.activeCategoryId;

state = addTask(state, {
  title: "地域清掃イベント参加",
  owner: "you",
  categoryId,
  visibility: "shared",
});

let partnerView = visibleTasks(state, "partner", categoryId);
assert.equal(partnerView.length, 1, "共有タスクは相手から見える");
assert.equal(partnerView[0].completed, false, "初期状態は未完了");

state = toggleTask(state, state.tasks[0].id);
partnerView = visibleTasks(state, "partner", categoryId);
assert.equal(partnerView[0].completed, true, "完了状態の更新を相手も確認できる");

console.log("integration test: ok");
