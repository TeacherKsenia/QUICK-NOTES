(function (global) {
  'use strict';

  const PLACEHOLDERS = Object.freeze({
    'Search notes and people': 'Поиск заметок и учеников',
    'Search notes, students and groups': 'Поиск заметок, учеников и групп',
    'Write a short, useful note…': 'Напишите короткую полезную заметку…',
    'Type an observation…': 'Введите наблюдение…',
    'e.g. Sophie': 'например, София',
    'e.g. B1 · Conversation': 'например, B1 · Разговорный',
    'e.g. Masha + Petya': 'например, Маша + Петя',
    'e.g. Pair · B1': 'например, Пара · B1'
  });

  function replacementMap(language) {
    return language === 'ru'
      ? PLACEHOLDERS
      : Object.fromEntries(Object.entries(PLACEHOLDERS).map(([english, russian]) => [russian, english]));
  }

  function translateUIValue(value, orderedPairs, language) {
    if (!value) return value;
    const trimmed = value.trim();
    for (const [english, russian] of orderedPairs) {
      const source = language === 'ru' ? english : russian;
      const target = language === 'ru' ? russian : english;
      if (trimmed === source || trimmed.startsWith(`${source} `)) return value.replace(source, target);
    }
    return value;
  }

  function translateTree(root, pairs, language) {
    const orderedPairs = [...pairs].sort((a, b) => b[0].length - a[0].length);
    const scope = root.body || root;
    const ownerDocument = root.createTreeWalker ? root : scope.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue;
      if (!raw.trim()) continue;
      node.nodeValue = translateUIValue(raw, orderedPairs, language);
    }

    const placeholders = replacementMap(language);
    scope.querySelectorAll?.('[placeholder]').forEach((element) => {
      if (placeholders[element.placeholder]) {
        element.placeholder = placeholders[element.placeholder];
      } else {
        element.placeholder = translateUIValue(element.placeholder, orderedPairs, language);
      }
    });
    scope.querySelectorAll?.('[title],[aria-label],[data-tooltip]').forEach((element) => {
      for (const attribute of ['title', 'aria-label', 'data-tooltip']) {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, translateUIValue(value, orderedPairs, language));
      }
    });
  }

  function text(pairs, language, value) {
    if (language !== 'ru') return value;
    return pairs.find(([english]) => english === value)?.[1] || value;
  }

  function message(messages, language, key, values = {}) {
    const template = messages?.[key]?.[language] || messages?.[key]?.en || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  }

  global.QuickNotesI18n = Object.freeze({ translateTree, text, message });
})(window);
