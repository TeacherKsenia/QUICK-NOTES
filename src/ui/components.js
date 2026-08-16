(function bootstrapQuickNotesUI(global) {
  'use strict';

  const joinClasses = (...values) => values.filter(Boolean).join(' ');
  const categoryIcon = category => global.QuickNotesCategoryIcons ? global.QuickNotesCategoryIcons.svg(category.icon) : category.icon;

  function button({ content, variant = 'secondary', classes = '', attributes = '' }) {
    return `<button class="${joinClasses(variant, classes)}" ${attributes}>${content}</button>`;
  }

  function chip({ content, active = false, classes = '', attributes = '' }) {
    return `<button class="${joinClasses('filter-chip', active && 'active', classes)}" ${attributes}>${content}</button>`;
  }

  function segmentedControl({ items, value, classes = '', label = '' }) {
    return `<div class="${joinClasses('segmented-control', classes)}" role="group" aria-label="${label}">${items.map(item => `<button type="button" data-value="${item.value}" aria-pressed="${String(item.value === value)}" class="${item.value === value ? 'active' : ''}">${item.label}</button>`).join('')}</div>`;
  }

  function filterBar({ content, classes = '' }) {
    return `<nav class="${joinClasses('filter-bar', classes)}">${content}</nav>`;
  }

  function profileHeader({ content, actions = '', classes = '' }) {
    return `<header class="${joinClasses('profile-head', classes)}"><div class="profile-title">${content}</div>${actions}</header>`;
  }

  function dialog({ id, title, content, actions = '', classes = '' }) {
    return `<dialog class="${joinClasses('modal', classes)}" id="${id}"><form method="dialog"><header class="modal-head"><h2>${title}</h2></header>${content}${actions ? `<footer class="modal-actions">${actions}</footer>` : ''}</form></dialog>`;
  }

  function iconButton({ classes = '', attributes = '', label, title = label, content }) {
    return `<button class="${joinClasses('icon-only', classes)}" ${attributes} data-tooltip="${title}" aria-label="${label}">${content}</button>`;
  }

  function sidebarItem({ person, active, avatarStyle, avatarContent, profileMeta, escape, attributes, classes = '', count }) {
    const itemAttributes = attributes || `data-person="${person.id}"`;
    const itemCount = count ?? person.notes.length;
    return `<button class="${joinClasses('person-item', active && 'active', classes)}" ${itemAttributes}><span class="avatar" ${avatarStyle(person)}>${avatarContent(person)}</span><span class="person-copy"><b>${escape(person.name)}</b><small>${escape(profileMeta(person))}</small></span><span class="person-count">${itemCount}</span></button>`;
  }

  function noteActions({ note, categories = {} }) {
    const moveOptions = Object.entries(categories).map(([key, category]) => `<button type="button" class="move-category-option ${key === note.category ? 'current' : ''}" data-move-note="${note.id}" data-move-category="${key}" ${key === note.category ? 'disabled aria-current="true"' : ''}><span>${category.label}</span>${key === note.category ? '<span class="menu-check">✓</span>' : ''}</button>`).join('');
    return `<span class="note-actions"><button class="more-btn" type="button" data-menu-toggle="note-${note.id}" aria-expanded="false" aria-label="Note actions">•••</button><span class="action-menu note-action-menu" id="note-${note.id}" hidden><button type="button" class="menu-move-trigger" data-move-menu="move-${note.id}" aria-expanded="false"><span>Move to…</span><span class="menu-chevron">›</span></button><button type="button" class="menu-danger" data-delete="${note.id}">Delete</button><span class="move-submenu" id="move-${note.id}" hidden>${moveOptions}</span></span></span>`;
  }

  function emptyState({ title, description, classes = '' }) {
    return `<div class="${joinClasses('empty', classes)}"><div><strong>${title}</strong>${description}</div></div>`;
  }

  function categoryCard({ key, category, notes, pinned, escape, fullDate, relativeTime, noteActions: renderNoteActions, pinIcon }) {
    const shown = notes.slice(0, 3);
    const pinLabel = pinned ? 'Unpin category' : 'Pin category';
    const content = shown.length
      ? shown.map(note => `<div class="note" data-note-id="${note.id}" tabindex="0"><p>${escape(note.text)}</p><time title="Created ${fullDate(note.createdAt)}">${fullDate(note.createdAt)} · ${relativeTime(note.createdAt)}</time>${renderNoteActions(note)}</div>`).join('')
      : emptyState({ title: 'No notes yet', description: 'Capture an observation here.' });
    return `<article class="category-card cat-${key}"><header class="category-head category-head-link" data-view-category="${key}" tabindex="0" role="button" aria-label="Open ${category.label} notes"><span class="cat-icon">${categoryIcon(category)}</span><h2>${category.label}</h2><span class="badge">${notes.length}</span>${iconButton({ classes: `category-pin ${pinned ? 'active' : ''}`, attributes: `data-pin-category="${key}"`, label: pinLabel, content: pinIcon })}</header><div class="note-list">${content}</div><button class="view-all" data-view-category="${key}" aria-label="Open all ${category.label} notes">Show all${notes.length ? ` ${notes.length}` : ''} <span>→</span></button></article>`;
  }

  function noteTile({ note, escape, fullDate, relativeTime, noteActions: renderNoteActions }) {
    return `<article class="note-tile" data-note-id="${note.id}" tabindex="0"><p>${escape(note.text)}</p><footer><time><b>${fullDate(note.createdAt)}</b><span>${relativeTime(note.createdAt)}</span></time>${renderNoteActions(note)}</footer></article>`;
  }

  function focusedCategory({ key, category, notes, pinned, sort, visibleCount, pinIcon, escape, fullDate, relativeTime, noteActions: renderNoteActions }) {
    const sorted = [...notes].sort((a, b) => sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    const shown = sorted.slice(0, visibleCount);
    const pinLabel = pinned ? 'Unpin this category' : 'Keep this category visible';
    const empty = emptyState({
      title: `No notes in ${category.label}`,
      description: 'Add the first observation for this category.',
      classes: 'focus-empty'
    });
    const tiles = shown.length
      ? shown.map(note => noteTile({ note, escape, fullDate, relativeTime, noteActions: renderNoteActions })).join('')
      : empty;
    const remaining = sorted.length - shown.length;
    return `<section class="focus-view"><div class="focus-head"><div class="focus-title"><span class="cat-icon cat-${key}">${categoryIcon(category)}</span><div><h2>${category.label}</h2><p>${notes.length} ${notes.length === 1 ? 'note' : 'notes'}</p></div></div><div class="focus-tools">${iconButton({ classes: `pin-category ${pinned ? 'active' : ''}`, attributes: `data-pin-category="${key}"`, label: pinLabel, content: pinIcon })}<select id="sortNotes" aria-label="Sort notes"><option value="newest" ${sort === 'newest' ? 'selected' : ''}>Newest first</option><option value="oldest" ${sort === 'oldest' ? 'selected' : ''}>Oldest first</option></select>${button({ content: '&#65291; Add note', variant: 'primary', attributes: `data-add-cat="${key}"` })}</div></div><div class="note-grid">${tiles}</div>${remaining > 0 ? `<button class="show-more" id="showMore">Show ${Math.min(12, remaining)} more <span>${shown.length} of ${sorted.length}</span></button>` : ''}</section>`;
  }

  global.QuickNotesUI = Object.freeze({
    button,
    categoryCard,
    chip,
    dialog,
    emptyState,
    filterBar,
    focusedCategory,
    iconButton,
    noteActions,
    noteTile,
    profileHeader,
    segmentedControl,
    sidebarItem,
  });
})(window);
