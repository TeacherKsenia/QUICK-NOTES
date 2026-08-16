(function (global) {
  'use strict';

  function option(value, label, selected = false) {
    return `<option value="${value}"${selected ? ' selected' : ''}>${label}</option>`;
  }

  function peopleOptions({ people, type, selectedId = '', placeholder, escape }) {
    const items = people
      .filter((person) => person.type === type)
      .map((person) => option(person.id, escape(person.name), person.id === selectedId))
      .join('');
    return option('', placeholder) + items;
  }

  function groupSubjectOptions({ group, people, language, escape }) {
    const wholeGroup = language === 'ru' ? 'Вся группа' : 'Whole group';
    const members = (group.memberIds || [])
      .map((id) => people.find((person) => person.id === id))
      .filter(Boolean)
      .map((person) => option(person.id, escape(person.name)))
      .join('');
    return option(group.id, wholeGroup) + members;
  }

  function resolveTarget({ people, contextId, subjectId }) {
    const context = people.find((person) => person.id === contextId);
    if (!context) return { context: null, target: null, valid: false };
    if (context.type !== 'group') return { context, target: context, valid: true };
    const allowedIds = new Set([context.id, ...(context.memberIds || [])]);
    const target = allowedIds.has(subjectId)
      ? people.find((person) => person.id === subjectId)
      : null;
    return { context, target, valid: Boolean(target) };
  }

  function createSelectionModel({ people, contextId = '', subjectId = '' }) {
    let context = contextId;
    let subject = subjectId;
    return {
      selectContext(nextContextId) {
        context = nextContextId || '';
        const selected = people.find((person) => person.id === context);
        subject = selected?.type === 'group' ? selected.id : context;
        return this.value;
      },
      selectSubject(nextSubjectId) {
        subject = nextSubjectId || '';
        return this.value;
      },
      get value() {
        return resolveTarget({ people, contextId: context, subjectId: subject });
      }
    };
  }

  function windowMarkup({ targetPickerMarkup, categoryMarkup }) {
    return `<main class="lesson-mini"><header><div><span class="live-dot"></span><div><h1>Lesson mode</h1><p>Quick capture</p></div></div><button id="miniClose" aria-label="Close">×</button></header><form id="miniForm"><div class="capture-target-field"><span class="capture-field-label">Student or group</span>${targetPickerMarkup}</div><label id="miniAboutWrap" hidden>Note about<select id="miniAbout"></select></label><label>Category<select id="miniCategory">${categoryMarkup}</select></label><label>Note<textarea id="miniText" rows="4" maxlength="500" required placeholder="Type an observation…"></textarea></label><button class="add" type="submit">Add note <kbd>Ctrl ↵</kbd></button></form><p class="status" id="miniStatus">Ready for your next note</p></main>`;
  }

  function fontSizeValue(size) {
    return size === 'extra' ? 16 : size === 'large' ? 15 : 14;
  }

  /*
   * Lesson mode keeps one structural stylesheet. Themes supply visual values
   * through this token map; the legacy full-width themed header is an explicit
   * compatibility variant until its geometry can be unified without changing
   * the approved appearance.
   */
  function windowStyleTokens(theme) {
    if (theme === 'night-forest') return {
      bodyBackground: 'linear-gradient(145deg,rgba(7,27,18,.91),rgba(31,55,39,.82)),url("assets/themes/leaves-wallpaper%20for%20forest%20night%20theme.jpg") center/cover fixed',
      bodyColor: '#18231b', headerBackground: 'linear-gradient(120deg,rgba(20,43,29,.92),rgba(51,73,53,.83))',
      headerColor: '#f3f2e9', headerMuted: '#c8d0c3', dot: '#9bac6d', dotRing: 'rgba(155,172,109,.2)',
      closeBackground: 'linear-gradient(145deg,rgba(240,240,231,.2),rgba(240,240,231,.1))', closeColor: '#f3f2e9',
      label: '#e4e5dc', fieldBackground: 'linear-gradient(145deg,rgba(247,246,238,.97),rgba(225,228,216,.95))', fieldColor: '#1c281e',
      fieldBorder: '0', fieldShadow: '0 8px 24px rgba(2,14,8,.18)', focusShadow: '0 0 0 3px rgba(141,158,91,.28),0 9px 25px rgba(2,14,8,.22)',
      button: 'linear-gradient(135deg,#6f8447,#87975f)', buttonHover: 'linear-gradient(135deg,#7c9250,#97a76c)', disabled: 'linear-gradient(135deg,#737b70,#92988e)',
      buttonShadow: '0 9px 23px rgba(2,14,8,.28)', status: '#c5cbbf', saved: '#dce5bd', themedHeader: true,
      headerExtra: 'box-shadow:0 10px 30px rgba(2,14,8,.24);backdrop-filter:blur(15px)', fieldRadius: '11px', focusBorder: 'transparent', buttonColor: '#f8f7ef', kbdBackground: 'rgba(255,255,255,.16)', pickerSearch: 'rgba(240,240,231,.92)', pickerHover: 'rgba(113,136,71,.13)', pickerHeading: '#60705f'
    };
    if (theme === 'forest-night') return {
      bodyBackground: '#f5f6f8', bodyColor: '#151820', headerBackground: '#5a31bd', headerColor: '#fff', headerMuted: '#ded2fa',
      dot: '#ffb800', dotRing: 'rgba(255,184,0,.2)', closeBackground: 'rgba(255,255,255,.15)', closeColor: '#fff', label: '#4f5662',
      fieldBackground: '#fff', fieldColor: '#20242d', fieldBorder: '0', fieldShadow: '0 2px 9px rgba(15,23,42,.08)', focusShadow: '0 0 0 3px rgba(90,49,189,.2)',
      button: '#5a31bd', buttonHover: '#6a3dd0', disabled: '#aeb2bd', buttonShadow: '0 7px 18px rgba(90,49,189,.22)', status: '#7b828d', saved: '#5a31bd', themedHeader: true,
      headerExtra: '', fieldRadius: '10px', focusBorder: 'transparent', buttonColor: '#fff', kbdBackground: 'rgba(255,255,255,.16)', pickerSearch: '#f1edfb', pickerHover: '#f5f2fc', pickerHeading: '#67558d'
    };
    /* Minimalism / classic: the separate Lesson Mode window uses the same
       closed palette as the main application. */
    return {
      bodyBackground: '#F5F5F2', bodyColor: '#1B2422', headerBackground: 'transparent', headerColor: '#1B2422', headerMuted: 'rgba(27,36,34,.58)',
      dot: '#839464', dotRing: 'rgba(131,148,100,.18)', closeBackground: '#FFFFFF', closeColor: '#1B2422', label: 'rgba(27,36,34,.72)', fieldBackground: '#FFFFFF',
      fieldColor: '#1B2422', fieldBorder: '1px solid rgba(27,36,34,.12)', fieldShadow: 'none', focusShadow: '0 0 0 3px rgba(28,104,86,.18)',
      button: '#1C6856', buttonHover: '#1C6856', disabled: '#8497B0', buttonShadow: '0 7px 18px rgba(28,104,86,.18)', status: 'rgba(27,36,34,.58)', saved: '#1C6856', themedHeader: false,
      headerExtra: '', fieldRadius: '10px', focusBorder: '#1C6856', buttonColor: '#F7FAF8', kbdBackground: 'rgba(247,250,248,.14)', pickerSearch: '#F2EBDD', pickerHover: '#F5F5F2', pickerHeading: '#1C6856'
    };
  }

  function windowStyles({ theme, fontSize }) {
    const t = windowStyleTokens(theme);
    const headerBox = t.themedHeader
      ? 'margin:0 -16px 16px;padding:15px 16px;'
      : 'margin-bottom:14px;';
    const bodyPadding = t.themedHeader ? '0 16px 10px' : '16px 16px 10px';
    return `*{box-sizing:border-box}[hidden]{display:none!important}html,body{margin:0;min-height:100%;font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:${t.bodyBackground};color:${t.bodyColor};font-size:${fontSizeValue(fontSize)}px}body{padding:${bodyPadding}}.lesson-mini{max-width:430px;margin:auto}header,header>div{display:flex;align-items:center;justify-content:space-between}header{${headerBox}background:${t.headerBackground};color:${t.headerColor};${t.headerExtra}}header>div{gap:11px}h1{margin:0;font-size:20px;line-height:1.15}header p{margin:3px 0 0;color:${t.headerMuted};font-size:11px}.live-dot{width:9px;height:9px;background:${t.dot};border-radius:50%;box-shadow:0 0 0 5px ${t.dotRing}}#miniClose{border:0;background:${t.closeBackground};border-radius:50%;width:34px;height:34px;color:${t.closeColor};font-size:20px;cursor:pointer}.capture-target-field{margin:12px 0}.capture-field-label{display:block;margin-bottom:6px;color:${t.label};font-size:12px;font-weight:650}.capture-person-picker{position:relative}.capture-person-trigger{display:flex;width:100%;min-height:42px;align-items:center;justify-content:space-between;gap:9px;border:${t.fieldBorder};background:${t.fieldBackground};border-radius:${t.fieldRadius};padding:7px 10px;color:${t.fieldColor};box-shadow:${t.fieldShadow};font:inherit;text-align:left;cursor:pointer}.capture-person-trigger:focus{outline:none;border-color:${t.focusBorder};box-shadow:${t.focusShadow}}.capture-person-trigger:disabled{opacity:.62;cursor:default}.capture-person-value{display:flex;min-width:0;align-items:center;gap:9px}.capture-person-value>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.capture-person-placeholder{color:${t.status}}.capture-person-avatar{display:grid;place-items:center;width:26px;height:26px;flex:0 0 26px;border-radius:8px;color:#fff;font-size:10px;font-weight:800;overflow:hidden}.capture-person-avatar img{width:100%;height:100%;object-fit:cover}.capture-person-chevron{font-size:16px;opacity:.6}.capture-person-menu{position:absolute;z-index:20;left:0;right:0;top:calc(100% + 5px);padding:7px;background:${t.fieldBackground};border:${t.fieldBorder};border-radius:12px;box-shadow:0 18px 42px rgba(0,0,0,.18)}.capture-person-search{display:flex;align-items:center;gap:7px;margin:0 0 6px;padding:0 9px;background:${t.pickerSearch};border-radius:9px}.capture-person-search input{width:100%;height:35px;padding:0;border:0;background:transparent;color:${t.fieldColor};outline:none;font:inherit}.capture-person-search svg{width:15px;height:15px;fill:none;stroke:${t.pickerHeading};stroke-width:1.8}.capture-person-options{max-height:230px;overflow:auto;padding-right:2px;scrollbar-width:thin;scrollbar-color:transparent transparent}.capture-person-options:hover{scrollbar-color:${t.pickerHeading} transparent}.capture-person-options::-webkit-scrollbar{width:4px}.capture-person-options::-webkit-scrollbar-track{background:transparent}.capture-person-options::-webkit-scrollbar-thumb{background:transparent;border-radius:99px}.capture-person-options:hover::-webkit-scrollbar-thumb{background:${t.pickerHeading}}.capture-person-section+ .capture-person-section{margin-top:7px}.capture-person-heading{padding:5px 7px 4px;color:${t.pickerHeading};font-size:9px;font-weight:800;letter-spacing:.12em}.capture-person-option{display:flex;width:100%;align-items:center;gap:9px;padding:6px 7px;border:0;border-radius:9px;background:transparent;color:${t.fieldColor};font:inherit;text-align:left;cursor:pointer}.capture-person-option:hover,.capture-person-option:focus-visible{background:${t.pickerHover};outline:none}.capture-person-empty{padding:12px 8px;text-align:center;color:${t.status};font-size:11px}label{display:block;margin:12px 0;color:${t.label};font-size:12px;font-weight:650}select,textarea{display:block;width:100%;margin-top:6px;border:${t.fieldBorder};background:${t.fieldBackground};border-radius:${t.fieldRadius};padding:10px 11px;color:${t.fieldColor};outline:none;font:inherit;resize:none;box-shadow:${t.fieldShadow}}select:focus,textarea:focus{border-color:${t.focusBorder};box-shadow:${t.focusShadow}}textarea{min-height:118px;line-height:1.45}.group-target label{margin:9px 0}.group-target textarea{min-height:82px}.add{position:sticky;bottom:7px;z-index:3;width:100%;min-height:42px;border:0;border-radius:11px;padding:10px 13px;background:${t.button};color:${t.buttonColor};font:inherit;font-weight:700;cursor:pointer;box-shadow:${t.buttonShadow}}.add:hover{background:${t.buttonHover}}.add:disabled{background:${t.disabled};box-shadow:none;cursor:not-allowed}kbd{float:right;background:${t.kbdBackground};padding:2px 6px;border-radius:5px;font-size:10px}.status{text-align:center;color:${t.status};font-size:11px;margin:9px 0 0;min-height:15px;transition:color .18s}.status.saved{color:${t.saved};font-weight:650}`;
  }

  global.QuickNotesLesson = Object.freeze({
    peopleOptions,
    groupSubjectOptions,
    resolveTarget,
    createSelectionModel,
    windowMarkup,
    windowStyles
  });
})(window);
