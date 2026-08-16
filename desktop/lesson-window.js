(() => {
  'use strict';

  const STORAGE_KEY = 'quick-notes-workspace-v1';
  const DEFAULT_CATEGORIES = {
    'quick-note': { label: 'Quick Note' },
    vocabulary: { label: 'Vocabulary' },
    grammar: { label: 'Grammar' },
    errors: { label: 'Errors' },
    interests: { label: 'Interests' },
    other: { label: 'Other / Ideas' }
  };
  const DEFAULT_SETTINGS = { language: 'en', theme: 'forest-night', fontSize: 'standard' };

  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  let workspace = null;

  function fallbackWorkspace() {
    return { people: [], categories: structuredClone(DEFAULT_CATEGORIES), settings: { ...DEFAULT_SETTINGS }, selectedId: '' };
  }

  function readWorkspace() {
    const value = window.quickNotesDesktopStorage?.read(STORAGE_KEY);
    const next = value && typeof value === 'object' ? value : fallbackWorkspace();
    next.people = Array.isArray(next.people) ? next.people : [];
    next.categories = next.categories && typeof next.categories === 'object' ? next.categories : structuredClone(DEFAULT_CATEGORIES);
    next.settings = { ...DEFAULT_SETTINGS, ...(next.settings || {}) };
    return next;
  }

  function isRu() { return workspace?.settings?.language === 'ru'; }
  function t(en, ru) { return isRu() ? ru : en; }

  function applyTheme() {
    const style = document.createElement('style');
    style.id = 'lessonRuntimeStyle';
    style.textContent = QuickNotesLesson.windowStyles({ theme: workspace.settings.theme, fontSize: workspace.settings.fontSize }).replaceAll('url(\"assets/', 'url(\"../assets/') + `
      .lesson-mini{max-width:430px}.empty-lesson{margin:18px 0;padding:18px;border-radius:12px;text-align:center;line-height:1.45;background:rgba(127,127,127,.09);color:inherit}
      select:disabled,textarea:disabled{opacity:.6;cursor:not-allowed}body{overflow:auto}
    `;
    document.querySelector('#lessonRuntimeStyle')?.remove();
    document.head.appendChild(style);
  }

  function option(value, label, selected = false) {
    return `<option value="${escapeHtml(value)}"${selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
  }

  function renderPeople(preserveId = '') {
    const select = $('#miniPerson');
    const people = workspace.people;
    const preferred = preserveId || workspace.selectedId || people[0]?.id || '';
    const individuals = people.filter(person => person.type === 'individual');
    const groups = people.filter(person => person.type === 'group');
    let html = `<option value="">${escapeHtml(t('Choose student or group', 'Выберите ученика или группу'))}</option>`;
    if (individuals.length) html += `<optgroup label="${escapeHtml(t('STUDENTS', 'УЧЕНИКИ'))}">${individuals.map(person => option(person.id, person.name, person.id === preferred)).join('')}</optgroup>`;
    if (groups.length) html += `<optgroup label="${escapeHtml(t('GROUPS', 'ГРУППЫ'))}">${groups.map(person => option(person.id, person.name, person.id === preferred)).join('')}</optgroup>`;
    select.innerHTML = html;
    if (preferred && people.some(person => person.id === preferred)) select.value = preferred;
  }

  function renderCategories(preserveCategory = '') {
    const select = $('#miniCategory');
    const entries = Object.entries(workspace.categories);
    select.innerHTML = entries.map(([key, category]) => option(key, category.label || key, key === preserveCategory)).join('');
    if (!select.value && entries.length) select.value = entries[0][0];
  }

  function updateGroupSubject() {
    const context = workspace.people.find(person => person.id === $('#miniPerson').value);
    const wrap = $('#miniAboutWrap');
    const about = $('#miniAbout');
    const isGroup = context?.type === 'group';
    wrap.hidden = !isGroup;
    if (!isGroup) {
      about.innerHTML = '';
      return;
    }
    const members = (context.memberIds || []).map(id => workspace.people.find(person => person.id === id)).filter(Boolean);
    about.innerHTML = option(context.id, t('Whole group', 'Вся группа'), true) + members.map(person => option(person.id, person.name)).join('');
  }

  function localizeUi() {
    document.documentElement.lang = isRu() ? 'ru' : 'en';
    $('#lessonHeading').textContent = t('Lesson mode', 'Режим урока');
    $('#lessonSubheading').textContent = t('Quick capture', 'Быстрая запись');
    $('#personLabel').textContent = t('Student or group', 'Ученик или группа');
    $('#aboutLabel').textContent = t('Note about', 'Заметка о');
    $('#categoryLabel').textContent = t('Category', 'Категория');
    $('#noteLabel').textContent = t('Note', 'Заметка');
    $('#miniText').placeholder = t('Type an observation…', 'Напишите заметку…');
    $('#addNote').childNodes[0].nodeValue = `${t('Add note', 'Добавить заметку')} `;
    $('#miniStatus').textContent = t('Ready for your next note', 'Готово для следующей заметки');
  }

  function syncForm({ preservePerson = true, preserveCategory = true } = {}) {
    const oldPerson = preservePerson ? $('#miniPerson')?.value : '';
    const oldCategory = preserveCategory ? $('#miniCategory')?.value : '';
    const oldSubject = $('#miniAbout')?.value || '';
    workspace = readWorkspace();
    applyTheme();
    localizeUi();
    renderPeople(oldPerson);
    renderCategories(oldCategory);
    updateGroupSubject();
    if (oldSubject && !$('#miniAboutWrap').hidden && [...$('#miniAbout').options].some(option => option.value === oldSubject)) $('#miniAbout').value = oldSubject;
    const hasPeople = workspace.people.length > 0;
    $('#emptyPeople').hidden = hasPeople;
    $('#emptyPeople').textContent = t('No students or groups yet. Open QUICK NOTES to add one.', 'Пока нет учеников или групп. Откройте QUICK NOTES и добавьте их.');
    $('#miniForm').hidden = !hasPeople;
    $('#miniStatus').hidden = !hasPeople;
    $('#addNote').disabled = !hasPeople || !$('#miniPerson').value;
  }

  function resolveCurrentTarget(fresh) {
    const contextId = $('#miniPerson').value;
    const context = fresh.people.find(person => person.id === contextId);
    if (!context) return { context: null, target: null };
    if (context.type !== 'group') return { context, target: context };
    const subjectId = $('#miniAbout').value || context.id;
    const allowed = new Set([context.id, ...(context.memberIds || [])]);
    const target = allowed.has(subjectId) ? fresh.people.find(person => person.id === subjectId) : null;
    return { context, target };
  }

  $('#miniPerson').addEventListener('change', () => {
    updateGroupSubject();
    $('#addNote').disabled = !$('#miniPerson').value;
    $('#miniText').focus();
  });

  $('#miniClose').addEventListener('click', () => window.close());

  $('#miniForm').addEventListener('submit', event => {
    event.preventDefault();
    const text = $('#miniText').value.trim();
    if (!text) return;

    const fresh = readWorkspace();
    const { context, target } = resolveCurrentTarget(fresh);
    if (!context || !target) {
      syncForm();
      return;
    }

    const category = $('#miniCategory').value || 'quick-note';
    target.notes = Array.isArray(target.notes) ? target.notes : [];
    target.notes.unshift({
      id: crypto.randomUUID(),
      category,
      text,
      createdAt: Date.now(),
      ...(target.type === 'individual' && context.type === 'group' ? { capturedInGroupId: context.id } : {})
    });

    const ok = window.quickNotesDesktopStorage?.write(STORAGE_KEY, fresh);
    if (ok === false) {
      $('#miniStatus').textContent = t('Could not save note', 'Не удалось сохранить заметку');
      return;
    }

    workspace = fresh;
    $('#miniText').value = '';
    const categoryLabel = fresh.categories?.[category]?.label || category;
    $('#miniStatus').textContent = t(`Saved to ${target.name} · ${categoryLabel}`, `Сохранено: ${target.name} · ${categoryLabel}`);
    $('#miniStatus').classList.add('saved');
    $('#miniText').focus();
    window.setTimeout(() => {
      $('#miniStatus').textContent = t('Ready for your next note', 'Готово для следующей заметки');
      $('#miniStatus').classList.remove('saved');
    }, 2200);
  });

  $('#miniText').addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      $('#miniForm').requestSubmit();
    }
  });

  window.quickNotesDesktop?.onStorageChanged?.(() => syncForm());
  window.addEventListener('focus', () => syncForm());

  syncForm({ preservePerson: false, preserveCategory: false });
  window.setTimeout(() => $('#miniText')?.focus(), 80);
})();
