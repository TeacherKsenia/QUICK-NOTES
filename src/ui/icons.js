(function bootstrapReplaceableIcons(global){
  'use strict';

  const safeName=value=>String(value||'').toLowerCase().replace(/[^a-z0-9-]/g,'');
  function markup(kind,name,{classes='',label=''}={}){
    const key=safeName(name);
    const className=[classes,'icon-mask',`icon-${kind}-${key}`].filter(Boolean).join(' ');
    const a11y=label?` role="img" aria-label="${String(label).replace(/"/g,'&quot;')}"`:' aria-hidden="true"';
    return `<span class="${className}"${a11y}></span>`;
  }
  function ui(name,options={}){return markup('ui',name,{classes:'ui-icon'+(options.classes?` ${options.classes}`:''),label:options.label||''})}
  function category(name,options={}){return markup('category',name,{classes:options.classes||'category-svg',label:options.label||''})}

  global.QuickNotesIcons=Object.freeze({
    ui,
    category,
    paths:Object.freeze({
      categoryPicker:'assets/icons/category-picker/',
      ui:'assets/icons/ui/'
    })
  });
})(window);
