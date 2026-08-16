(function bootstrapTodoUI(global) {
  'use strict';

  const DAY = 86400000;

  function localDateKey(value = Date.now()) {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  function uid(prefix = 'todo') {
    if (global.crypto?.randomUUID) return global.crypto.randomUUID();
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function createEmpty() {
    return { tasks: [], lists: [] };
  }

  // Kept as a compatibility alias for older code/backups; fresh installs are empty.
  function createSeed() {
    return createEmpty();
  }

  function normalize(todo) {
    const source = todo && typeof todo === 'object' ? todo : createEmpty();
    source.tasks = Array.isArray(source.tasks) ? source.tasks : [];
    source.lists = Array.isArray(source.lists) ? source.lists : [];
    source.lists.forEach((list, index) => {
      list.id ||= uid('list');
      list.name = String(list.name || 'List');
      list.icon = ['list', 'calendar', 'clock', 'star'].includes(list.icon) ? list.icon : 'list';
      list.dueDate = list.dueDate || '';
      list.pinned = Boolean(list.pinned);
      list.createdAt ||= Date.now() - index;
      list.updatedAt ||= list.createdAt;
      list.sortMode = ['manual', 'active-first', 'completed-first'].includes(list.sortMode) ? list.sortMode : 'manual';
    });
    const listIds = new Set(source.lists.map(list => list.id));
    source.tasks.forEach((task, index) => {
      task.id ||= uid('todo');
      task.text = String(task.text || '');
      task.completed = Boolean(task.completed);
      task.starred = Boolean(task.starred) && !task.completed;
      task.listId = listIds.has(task.listId) ? task.listId : '';
      task.dueDate = task.listId ? '' : (task.dueDate || '');
      task.createdAt ||= Date.now() - index;
      task.updatedAt ||= task.createdAt;
      task.order = Number.isFinite(Number(task.order)) ? Number(task.order) : index;
    });
    return source;
  }

  function icon(name) {
    const key = ['calendar','clock','list','star','pin','recent','focus','task','all','plus','sort'].includes(name) ? name : 'list';
    return global.QuickNotesIcons.ui(key);
  }

  function listTasks(todo, listId) {
    return todo.tasks.filter(task => task.listId === listId);
  }

  function standaloneTasks(todo) {
    return todo.tasks.filter(task => !task.listId);
  }

  function progress(todo, listId) {
    const tasks = listTasks(todo, listId);
    const completed = tasks.filter(task => task.completed).length;
    return { total: tasks.length, completed };
  }

  function touchList(todo, listId) {
    const list = todo.lists.find(item => item.id === listId);
    if (list) list.updatedAt = Date.now();
  }

  function sortListTasks(tasks, mode = 'manual') {
    const manual = [...tasks].sort((a, b) => a.order - b.order || a.createdAt - b.createdAt);
    if (mode === 'active-first') return manual.sort((a, b) => Number(a.completed) - Number(b.completed));
    if (mode === 'completed-first') return manual.sort((a, b) => Number(b.completed) - Number(a.completed));
    return manual;
  }

  global.QuickNotesTodo = Object.freeze({
    createEmpty,
    createSeed,
    icon,
    listTasks,
    localDateKey,
    normalize,
    progress,
    sortListTasks,
    standaloneTasks,
    touchList,
    uid,
  });
})(window);
