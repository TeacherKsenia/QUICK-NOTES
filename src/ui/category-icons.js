(function bootstrapCategoryIcons(global){
  'use strict';
  const order=Object.freeze(['pencil-spark','type','syntax','alert','heart','sparkle','bookmark','paw','shirt','book-open','speech','headphones','globe','flag','checklist','clock','gamepad','music','person','group','star','trophy','brain','rocket']);
  const labels=Object.freeze({'pencil-spark':'Pencil','type':'Text','syntax':'Grammar','alert':'Alert','heart':'Heart','sparkle':'Idea','bookmark':'Bookmark','paw':'Animals','shirt':'Clothes','book-open':'Book','speech':'Speech','headphones':'Listening','globe':'Globe','flag':'Flag','checklist':'Checklist','clock':'Clock','gamepad':'Game','music':'Music','person':'Person','group':'Group','star':'Star','trophy':'Trophy','brain':'Brain','rocket':'Rocket'});
  const legacy=Object.freeze({'✎':'pencil-spark','Aa':'type','◇':'syntax','!':'alert','♡':'heart','✦':'sparkle','＋':'bookmark','+':'bookmark'});
  const known=new Set(order);
  function normalize(value,fallback='bookmark'){return known.has(value)?value:(legacy[value]||fallback)}
  function svg(name,{classes='category-svg',label=''}={}){
    const key=normalize(name);
    return global.QuickNotesIcons.category(key,{classes,label});
  }
  global.QuickNotesCategoryIcons=Object.freeze({labels,order,normalize,svg});
})(window);
