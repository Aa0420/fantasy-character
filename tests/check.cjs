// node tests/check.cjs — pure data + simulated DOM integration, not a browser.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {TextEncoder}=require('node:util');
const root=path.resolve(__dirname,'..');
const scripts=['data/characters.js','data/world.js','data/core.js','script.js'];
const codes=scripts.map(file=>fs.readFileSync(path.join(root,file),'utf8'));
codes.forEach((code,i)=>new vm.Script(code,{filename:scripts[i]}));
const reports=[];
function test(name,fn){fn();reports.push(name);}
function plain(v){return JSON.parse(JSON.stringify(v));}
function boot(store=new Map(),options={}){
  const elements=new Map(),listeners={},timers=[];let blocked=!!options.blocked;
  function element(key){
    if(elements.has(key))return elements.get(key);
    const e={value:'',textContent:'',innerHTML:'',hidden:false,open:false,dataset:{},attrs:{},listeners:{},children:[],isConnected:true,src:'',
      classList:{add(){},remove(){},toggle(){},contains(){return false;}},
      setAttribute(k,v){this.attrs[k]=v;},hasAttribute(k){return Object.hasOwn(this.attrs,k);},
      addEventListener(k,f){this.listeners[k]=f;},showModal(){this.open=true;},close(){this.open=false;},scrollIntoView(){},focus(){document.activeElement=this;},
      reset(){this.values={};},append(child){this.children.push(child);},replaceChildren(){this.children=[];},click(){this.listeners.click?.({target:this});},
      querySelector(selector){return element(key+' '+selector);}
    };
    e.elements={namedItem(name){return element('form:'+name);}};elements.set(key,e);return e;
  }
  const document={activeElement:null,documentElement:{dataset:{}},
    querySelector(selector){if(selector==='dialog[open]')return [...elements].filter(([k,e])=>k.startsWith('#')&&e.open).map(x=>x[1])[0]||null;return element(selector);},
    querySelectorAll(selector){if(selector==='dialog'||selector==='dialog[open]')return ['#detail','#creator','#event-dialog','#import-dialog'].map(element).filter(e=>selector==='dialog'||e.open);if(selector==='.relationship-row')return element('#relationship-editor').children;return [];},
    getElementById(id){return element('#'+id);},createElement(tag){return element('created:'+tag+':'+elements.size);},addEventListener(k,f){listeners[k]=f;}
  };
  const context=vm.createContext({window:{addEventListener(){},matchMedia(){return {matches:false};}},document,TextEncoder,console,
    localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>{if(blocked)throw new Error('QuotaExceededError');store.set(k,v);}},
    location:{hash:''},setTimeout(fn){timers.push(fn);return timers.length;},clearTimeout(){},HTMLImageElement:class{},
    FormData:class{constructor(form){return Object.entries(form.values||{})[Symbol.iterator]();}},
    Blob:class{constructor(parts){this.parts=parts;}},URL:{createObjectURL(){return 'blob:test';},revokeObjectURL(){}},
  });
  codes.forEach((code,i)=>vm.runInContext(code,context,{filename:scripts[i]}));
  return {context,element,store,listeners,run:code=>vm.runInContext(code,context),block(value){blocked=value;},click(data){listeners.click({preventDefault(){},target:{closest(){return {dataset:data,classList:{contains(){return false;}},hasAttribute(){return false;}};}}});}};
}
const t=boot();const Core=t.context.window.WikiCore;
test('Four regional map images, originals and panel switching',()=>{
  const seen=new Set();
  assert.ok(fs.existsSync(path.join(root,'assets/maps/world-overview.jpg')));
  assert.ok(fs.existsSync(path.join(root,'assets/maps/originals/world-overview.png')));
  assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('src="./assets/maps/world-overview.jpg"'));
  for(const r of t.context.window.WIKI_WORLD.regions){
    assert.ok(!seen.has(r.mapImage));seen.add(r.mapImage);
    assert.ok(fs.existsSync(path.join(root,r.mapImage)),r.mapImage);
    assert.ok(fs.existsSync(path.join(root,r.mapOriginal)),r.mapOriginal);
    assert.ok(r.mapAlt.includes(r.name));
    t.click({region:r.id});
    const panel=t.element('#region-panel').innerHTML;
    assert.ok(panel.includes(`src="${r.mapImage}"`));
    assert.ok(panel.includes(`href="${r.mapOriginal}"`));
    assert.ok(panel.includes('loading="lazy"'));
    assert.ok(t.element('#region-tabs').innerHTML.includes(`src="${r.mapImage}"`));
    assert.equal((t.element('#map-markers').innerHTML.match(/data-region=/g)||[]).length,4);
  }
});
test('Original eight characters, images, IDs and references preserved',()=>{
  const chars=t.run('characters');assert.equal(chars.length,8);assert.equal(new Set(chars.map(c=>c.id)).size,8);
  for(const c of chars){assert.ok(fs.existsSync(path.join(root,c.image)));for(const r of c.relationships)assert.ok(chars.some(x=>x.id===r.id));}
  for(const r of t.context.window.WIKI_WORLD.regions)assert.ok(chars.some(c=>c.regionId===r.id));
  for(const e of t.context.window.WIKI_WORLD.events){e.characterIds.forEach(id=>assert.ok(chars.some(c=>c.id===id)));e.regionIds.forEach(id=>assert.ok(t.context.window.WIKI_WORLD.regions.some(r=>r.id===id)));}
});
test('Catalog search, combined filters, favorite-only and empty state',()=>{
  t.run("state.query='月光結界';render()");assert.match(t.element('#result-count').textContent,/共 1 位/);
  t.run("reset();state.faction='星詠庭';state.type='守護者';render()");assert.match(t.element('#result-count').textContent,/共 1 位/);
  t.run("state.query='找不到';render()");assert.equal(t.element('#empty').hidden,false);
  t.run("reset();toggleFavorite('lyra');state.saved=true;render()");assert.match(t.element('#result-count').textContent,/共 1 位/);
  assert.equal(boot(t.store).run("favorites.has('lyra')"),true);
});
test('Global search covers characters, regions, stories and historical types',()=>{
  assert.ok(t.run("searchAll('記憶古樹','region').some(x=>x.id==='verdant')"));
  assert.ok(t.run("searchAll('612','event').some(x=>x.id==='accord')"));
  assert.ok(t.run("searchAll('星橋騎士','character').some(x=>x.id==='noel')"));
  t.element('#global-query').value='暮影水都';t.run('renderSearch()');assert.match(t.element('#global-results-list').innerHTML,/data-region="dusk"/);
});
test('Delegated map/event/character/graph controls and history filters',()=>{
  t.click({region:'verdant'});assert.equal(t.run('state.region'),'verdant');assert.match(t.element('#region-panel').innerHTML,/希爾梵/);
  t.click({event:'seed'});assert.equal(t.element('#event-dialog').open,true);assert.match(t.element('#event-content').innerHTML,/data-detail="kai"/);
  t.click({detail:'lyra'});assert.equal(t.element('#detail').open,true);assert.equal(t.element('#event-dialog').open,false);
  t.click({graph:'lyra'});assert.equal(t.element('#detail').open,false);assert.equal(t.run('state.focus'),'lyra');
  t.run("state.relationType='朋友';renderGraph()");assert.ok(t.run("graphEdges().every(e=>e.type==='朋友')"));
  t.run("state.era='ancient';state.eventType='盟約';renderHistory()");assert.match(t.element('#event-count').textContent,/共 1 筆/);
  t.run("state.eventType='探索';renderHistory()");assert.match(t.element('#event-count').textContent,/共 0 筆/);
});
const legacy={id:'custom-old',name:'舊角色',title:'舊稱號',age:'20',birthday:'1月1日',race:'人類',job:'學者',appearance:'舊外貌',personality:'溫柔',story:'保留的故事',notes:'珍貴筆記',faction:'森之盟',type:'法師',abilities:['葉光'],relationships:[],image:'./assets/character-1.svg'};
test('V1 migration preserves custom character, favorite, theme and old keys',()=>{
  const store=new Map([['asteria-custom-v1',JSON.stringify([legacy])],['asteria-favorites-v1',JSON.stringify(['custom-old','lyra'])],['asteria-theme-v1','"dark"']]);
  const old=store.get('asteria-custom-v1'),app=boot(store);assert.equal(app.run('characters.length'),9);assert.equal(app.run("characters.find(c=>c.id==='custom-old').notes"),'珍貴筆記');assert.equal(app.context.document.documentElement.dataset.theme,'dark');assert.equal(store.get('asteria-custom-v1'),old);assert.equal(boot(store).run("favorites.has('custom-old')"),true);
  for(let i=2;i<=8;i++)assert.equal(Core.normalize({...legacy,image:`./assets/character-${i}.svg`}).image,Core.fallback);
});
test('Editing original uses overlays and persists all relation types after reload',()=>{
  t.run("var edited=clone(characters.find(c=>c.id==='lyra'));edited.name='璃月·更新';edited.relationships=[{id:'noel',type:'戀人',label:'測試設定'},{id:'raven',type:'敵人',label:'測試對立'}];saveCharacter(edited)");
  assert.equal(t.context.window.WIKI_CHARACTERS[0].name,'璃月');assert.equal(boot(t.store).run("characters.find(c=>c.id==='lyra').name"),'璃月·更新');
  assert.equal(boot(t.store).run("characters[0].relationships[0].type"),'戀人');assert.equal(boot(t.store).run("characters[0].relationships[1].type"),'敵人');
});
test('Create form, text escaping and custom edits retain identity',()=>{
  t.run("editingId='';draftImage=Core.fallback");
  const form=t.element('#character-form');form.values={...legacy,name:'新<script>',abilities:'光，風',regionId:'verdant'};
  delete form.values.id;delete form.values.relationships;delete form.values.image;
  t.run('state.query="";state.saved=false;state.faction="";state.type=""');
  t.run('submitCharacter')({preventDefault(){},currentTarget:form});
  assert.equal(t.run('characters.length'),9);assert.ok(t.element('#character-list').innerHTML.includes('&lt;script&gt;'));
  t.run("var created=clone(characters.at(-1));created.story='修改後的故事';saveCharacter(created)");
  assert.equal(boot(t.store).run('characters.at(-1).story'),'修改後的故事');assert.ok(t.run('characters.at(-1).image').endsWith('default-character.svg'));
});
test('JSON roundtrip and merge retain unrelated characters, favorites and images',()=>{
  const snapshot=plain(t.run('library'));assert.deepEqual(plain(Core.validate(JSON.parse(JSON.stringify(snapshot)))),snapshot);
  const incoming=Core.migrate([{...legacy,id:'custom-import',image:'data:image/png;base64,iVBORw0KGgo='}],['custom-import'],'dark').state;
  const merged=Core.merge(snapshot,incoming);assert.equal(merged.custom.length,2);assert.ok(merged.favorites.includes('lyra'));assert.ok(merged.favorites.includes('custom-import'));assert.equal(merged.theme,'dark');assert.match(merged.custom.find(c=>c.id==='custom-import').image,/^data:image/);
});
test('Malformed JSON/schema, duplicates, unsafe images and dangling relations rejected',()=>{
  const snapshot=plain(t.run('library'));
  assert.throws(()=>Core.validate({...snapshot,version:999}));assert.throws(()=>Core.validate({...snapshot,custom:[legacy,legacy]}));
  assert.throws(()=>Core.normalize({...legacy,image:'javascript:alert(1)'}));assert.throws(()=>Core.normalize({...legacy,image:'https://example.com/x.jpg'}));assert.throws(()=>Core.normalize({...legacy,image:'data:image/svg+xml;base64,AAAA'}));
  assert.throws(()=>Core.validate({...snapshot,custom:[{...legacy,relationships:[{id:'custom-missing',type:'朋友',label:'不存在'}]}]}));
  assert.throws(()=>Core.normalize({...legacy,relationships:[{id:'custom-old',type:'朋友',label:'自己'}]}));
  assert.equal(Core.safeImage('data:image/png;base64,AAAAA'),false);
});
test('Storage failure is atomic, corrupt old data not overwritten',()=>{
  const prior=plain(t.run('library'));const stored=t.store.get('asteria-library-v2');t.block(true);assert.equal(t.run("saveCharacter({...characters[0],name:'不應寫入'})"),false);assert.deepEqual(plain(t.run('library')),prior);assert.equal(t.store.get('asteria-library-v2'),stored);t.block(false);
  const corrupt=new Map([['asteria-custom-v1','{broken']]);boot(corrupt);assert.equal(corrupt.get('asteria-custom-v1'),'{broken');assert.equal(corrupt.has('asteria-library-v2'),false);
});
test('HTML, CSS and Wiki links stay local and valid under Pages subpaths',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)){if(m[1].startsWith('./'))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);else assert.ok(!m[1].startsWith('/'),'Root-relative path');}
  for(const m of html.matchAll(/href="#([a-z-]+)"/g))assert.ok(ids.includes(m[1]),m[1]);
  for(const file of fs.readdirSync(path.join(root,'wiki')).filter(f=>f.endsWith('.md'))){const text=fs.readFileSync(path.join(root,'wiki',file),'utf8');for(const m of text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g))if(!/^https?:/.test(m[1]))assert.ok(fs.existsSync(path.resolve(root,'wiki',m[1])),m[1]);}
  for(const file of ['assets/world.svg','assets/character-1.svg','assets/region-icons.svg','assets/default-character.svg'])assert.ok(fs.existsSync(path.join(root,file)));
  const css=fs.readFileSync(path.join(root,'world.css'),'utf8');assert.match(css,/@media\(max-width:520px\)/);assert.match(css,/prefers-reduced-motion/);
});
console.log(`PASS ${reports.length} test groups:\n${reports.map(r=>'  ✓ '+r).join('\n')}`);

(async()=>{
const app=boot();const original=app.store.get('asteria-library-v2');
const incoming=plain(app.context.window.WikiCore.migrate([{...legacy,id:'custom-json'}],['custom-json'],'dark').state);
await app.run('prepareImport')({size:500,text:async()=>JSON.stringify(incoming)});
assert.equal(app.element('#import-dialog').open,true);assert.equal(app.store.get('asteria-library-v2'),original);
app.element('#import-dialog').close();assert.equal(app.run('characters.length'),8);
await app.run('prepareImport')({size:500,text:async()=>JSON.stringify(incoming)});
app.element('#import-confirm').listeners.click();assert.equal(app.run('characters.length'),9);assert.equal(boot(app.store).run('characters.length'),9);
const merged=app.store.get('asteria-library-v2');await app.run('prepareImport')({size:20,text:async()=>'{broken'});assert.equal(app.store.get('asteria-library-v2'),merged);
await app.run('prepareImport')({size:9*1024*1024,text:async()=>{throw new Error('Should not read oversized file');}});assert.equal(app.store.get('asteria-library-v2'),merged);
app.run("retainedImage='./assets/characters/lyra.jpg';uploadedImage='data:image/png;base64,iVBORw0KGgo='");app.element('#image-choice').listeners.change({target:{value:'current'}});assert.equal(app.run('draftImage'),'./assets/characters/lyra.jpg');app.element('#image-choice').listeners.change({target:{value:'uploaded'}});assert.match(app.run('draftImage'),/^data:image/);
app.run('exportData()');assert.match(app.element('#toast').textContent,/備份/);
console.log('PASS async integration: import preview/cancel/confirm/reload, corrupt and oversized file, image switching, export action');
})();
