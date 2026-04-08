import assert from "node:assert/strict";
import { createInitialState, addCategory, addTask, visibleTasks } from "../taskCore.js";

const initial = createInitialState();
assert.equal(initial.categories.length, 2, "初期カテゴリは2件");

const withCategory = addCategory(initial, "学習");
assert.equal(withCategory.categories.length, 3, "カテゴリ追加できる");
assert.equal(withCategory.categories.at(-1).name, "学習");

const addedTaskState = addTask(withCategory, {
  title: "英語の課題を提出",
  owner: "you",
  categoryId: withCategory.activeCategoryId,
  visibility: "private",
});
assert.equal(addedTaskState.tasks.length, 1, "タスク追加できる");

const mine = visibleTasks(addedTaskState, "you", withCategory.activeCategoryId);
assert.equal(mine.length, 1, "作成者はprivateを見られる");

const partner = visibleTasks(addedTaskState, "partner", withCategory.activeCategoryId);
assert.equal(partner.length, 0, "他者はprivateを見られない");

console.log("unit test: ok");
