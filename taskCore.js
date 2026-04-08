/**
 * タスク管理のビジネスロジックをまとめたファイル。
 * UI（画面）と分離しておくことで、テストしやすく、初心者でも読みやすくします。
 */

export const USERS = {
  you: "あなた",
  partner: "パートナー",
};

/**
 * 初期データを作成します。
 */
export function createInitialState() {
  return {
    categories: [
      { id: "cat-social", name: "社会" },
      { id: "cat-private", name: "プライベート" },
    ],
    activeCategoryId: "cat-social",
    tasks: [],
  };
}

/**
 * カテゴリ（タブ）を追加します。
 */
export function addCategory(state, name) {
  const trimmed = name.trim();
  if (!trimmed) return state;

  const category = {
    id: `cat-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    name: trimmed,
  };

  return {
    ...state,
    categories: [...state.categories, category],
    activeCategoryId: category.id,
  };
}

/**
 * タスクを追加します。
 */
export function addTask(state, { title, owner, categoryId, visibility }) {
  const trimmed = title.trim();
  if (!trimmed) return state;

  const task = {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title: trimmed,
    owner,
    categoryId,
    visibility, // private | shared
    completed: false,
  };

  return { ...state, tasks: [...state.tasks, task] };
}

/**
 * 完了状態を反転します。
 */
export function toggleTask(state, taskId) {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    ),
  };
}

/**
 * 利用者ごとに見えるタスクを返します。
 * 共有タスクは2人とも見え、privateは作成者のみ見えます。
 */
export function visibleTasks(state, viewer, activeCategoryId) {
  return state.tasks.filter((task) => {
    const sameCategory = task.categoryId === activeCategoryId;
    const canSee = task.visibility === "shared" || task.owner === viewer;
    return sameCategory && canSee;
  });
}
