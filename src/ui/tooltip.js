(function bootstrapTooltip(global){
  'use strict';
  const targetSelector='.sidebar-home-btn,.nav-section-add,.visibility-toggle,.category-strip-arrow,.category-pin,.pin-category,.todo-list-pin-toggle,.todo-task-check,.todo-task-star,.more-btn,.icon-only,.close,.photo-remove-icon,.category-delete,.category-icon-button,.category-icon-choice,[data-tooltip]';
  let localize=value=>value,active=null,tip=null,showTimer=0,hideTimer=0;
  function sourceFor(el){return el?.dataset.tooltip||el?.getAttribute('aria-label')||''}
  function prepare(root=document){
    const nodes=[];
    if(root?.nodeType===1&&root.hasAttribute?.('title'))nodes.push(root);
    root?.querySelectorAll?.('[title]').forEach(el=>nodes.push(el));
    nodes.forEach(el=>{const value=el.getAttribute('title');if(value&&el.matches(targetSelector)&&!el.dataset.tooltip)el.dataset.tooltip=value;el.removeAttribute('title')});
  }
  function ensureTip(host){
    if(tip?.isConnected&&tip.parentElement===host)return tip;
    tip?.remove();tip=document.createElement('div');tip.className='app-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;host.append(tip);return tip;
  }
  function position(el){
    if(!tip||tip.hidden)return;const r=el.getBoundingClientRect(),t=tip.getBoundingClientRect(),gap=8,margin=8;
    let left=r.left+(r.width-t.width)/2,top=r.bottom+gap;
    if(top+t.height>innerHeight-margin)top=r.top-t.height-gap;
    left=Math.max(margin,Math.min(innerWidth-t.width-margin,left));top=Math.max(margin,Math.min(innerHeight-t.height-margin,top));
    tip.style.left=`${Math.round(left)}px`;tip.style.top=`${Math.round(top)}px`;
  }
  function show(el){clearTimeout(hideTimer);clearTimeout(showTimer);showTimer=setTimeout(()=>{const source=sourceFor(el);if(!source)return;active=el;const host=el.closest('dialog')||document.body;ensureTip(host);tip.textContent=localize(source);tip.hidden=false;requestAnimationFrame(()=>{tip.classList.add('show');position(el)})},320)}
  function hide(){clearTimeout(showTimer);hideTimer=setTimeout(()=>{active=null;if(tip){tip.classList.remove('show');setTimeout(()=>{if(tip&&!tip.classList.contains('show'))tip.hidden=true},120)}},70)}
  function candidate(node){return node?.closest?.(targetSelector)}
  function init(localizer){if(localizer)localize=localizer;prepare(document);if(document.documentElement.dataset.tooltipReady)return;document.documentElement.dataset.tooltipReady='1';
    document.addEventListener('pointerover',e=>{const el=candidate(e.target);if(el&&!el.disabled)show(el)});
    document.addEventListener('pointerout',e=>{const el=candidate(e.target);if(el&&(!e.relatedTarget||!el.contains(e.relatedTarget)))hide()});
    document.addEventListener('focusin',e=>{const el=candidate(e.target);if(el&&!el.disabled)show(el)});
    document.addEventListener('focusout',e=>{if(candidate(e.target))hide()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
    addEventListener('scroll',()=>{if(active)position(active)},{passive:true,capture:true});addEventListener('resize',()=>{if(active)position(active)},{passive:true});
    const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)prepare(node)})));observer.observe(document.body,{childList:true,subtree:true});
  }
  global.QuickNotesTooltip=Object.freeze({init,prepare,refresh:prepare});
})(window);
