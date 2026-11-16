/* Pure data layer: no DOM, network or storage side effects. */
(function () {
  'use strict';
  const base = window.WIKI_CHARACTERS;
  const regions = window.WIKI_WORLD.regions;
  const relationTypes = ['朋友','戀人','家人','敵人','夥伴'];
  const fallback = './assets/default-character.svg';
  const imagePaths = new Set([fallback,...base.map(c=>c.image),'./assets/character-1.svg']);
  // Retired placeholders remain import-compatible without retaining unused files.
  const retiredImages = new Set(Array.from({length:7},(_,i)=>`./assets/character-${i+2}.svg`));
  const limits = {name:30,enName:60,title:60,age:30,birthday:40,race:40,job:60,appearance:1000,personality:1000,story:5000,notes:2000};
  function fail(message) { throw new Error(message); }
  function safeImage(value) {
    if(typeof value!=='string')return false;
    if(imagePaths.has(value))return true;
    const match=/^data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
    if(!match || match[1].length%4!==0)return false;
    const padding=match[1].endsWith('==')?2:match[1].endsWith('=')?1:0;
    return match[1].length*3/4-padding<=500*1024;
  }
  function inferredType(label) { return /家人|兄長/.test(label) ? '家人' : /朋友|摯友/.test(label) ? '朋友' : '夥伴'; }
  function regionFor(c) { return regions.find(r=>r.faction===c.faction)?.id || 'astral'; }
  function normalize(c,legacy=false) {
    if (!c || typeof c !== 'object' || Array.isArray(c)) fail('角色格式不正確。');
    if (typeof c.id !== 'string' || !/^(?:custom-[a-zA-Z0-9-]{1,90}|lyra|sylvan|raven|flora|noel|eve|kai|mira)$/.test(c.id)) fail('角色 ID 無效。');
    const result = {id:c.id};
    for (const [key,max] of Object.entries(limits)) {
      const value = c[key] ?? '';
      if (typeof value !== 'string' || value.length > max) fail(`角色 ${key} 欄位格式或長度不正確。`);
      result[key] = value.trim();
    }
    if (!result.name || !result.story) fail('角色名稱與背景故事為必填。');
    if (!regions.some(r=>r.faction===c.faction) || !['法師','守護者','遊俠','療癒師'].includes(c.type)) fail('角色陣營或職能無效。');
    result.faction = c.faction; result.type = c.type;
    if (!Array.isArray(c.abilities) || !c.abilities.length || c.abilities.length > 150 || !c.abilities.every(a=>typeof a==='string' && a.trim() && a.length<=300)) fail('能力必須包含 1–150 個文字項目，每項最多 300 字。');
    result.abilities = c.abilities.map(a=>a.trim());
    const region = c.regionId ?? regionFor(c);
    if (!regions.some(r=>r.id===region)) fail('角色地區不存在。');
    result.regionId = region;
    const image = retiredImages.has(c.image) ? fallback : c.image || fallback;
    if (!safeImage(image)) { if (legacy) result.image=fallback; else fail('圖片只接受本機預設圖或 500 KiB 以內的 PNG/JPEG/WebP。'); } else result.image=image;
    const relationships = c.relationships ?? [];
    if (!Array.isArray(relationships) || relationships.length>30) fail('每位角色最多設定 30 筆關係。');
    const seen = new Set();
    result.relationships = relationships.map(r=> {
      if (!r || typeof r.id!=='string' || typeof r.label!=='string' || r.label.length>150 || r.id===c.id) fail('人物關係格式無效或指向自己。');
      const type = r.type ?? inferredType(r.label);
      if (!relationTypes.includes(type) || seen.has(`${r.id}:${type}`)) fail('關係類型無效或重複。');
      seen.add(`${r.id}:${type}`);
      return {id:r.id,type,label:r.label.trim() || type};
    });
    result.custom = c.id.startsWith('custom-');
    result.featured = !result.custom && base.some(b=>b.id===c.id && b.featured);
    return result;
  }
  function resolve(state) {
    const overrides = new Map(state.overrides.map(c=>[c.id,c]));
    return [...base.map(c=>overrides.get(c.id) || normalize(c,true)),...state.custom];
  }
  function validate(input) {
    if (!input || input.version!==2 || !Array.isArray(input.custom) || !Array.isArray(input.overrides) || !Array.isArray(input.favorites) || !['light','dark'].includes(input.theme)) fail('備份版本或格式不正確，需要版本 2。');
    if (input.custom.length>100 || input.overrides.length>base.length) fail('最多可保存 100 位自訂角色。');
    const result={version:2,custom:input.custom.map(c=>normalize(c)),overrides:input.overrides.map(c=>normalize(c)),favorites:[],theme:input.theme};
    const ids = new Set();
    for(const c of [...result.custom,...result.overrides]) {
      if(ids.has(c.id)) fail('匯入包含重複的角色 ID。'); ids.add(c.id);
    }
    if(result.custom.some(c=>!c.custom) || result.overrides.some(c=>c.custom || !base.some(b=>b.id===c.id))) fail('角色與覆寫的分類不正確。');
    const all = resolve(result); const allIds = new Set(all.map(c=>c.id));
    for(const c of all) for(const r of c.relationships) if(!allIds.has(r.id)) fail(`人物關係找不到目標：${r.id}`);
    if(input.favorites.length>108 || !input.favorites.every(id=>typeof id==='string' && allIds.has(id))) fail('收藏含有不存在的角色。');
    result.favorites=[...new Set(input.favorites)];
    if(new TextEncoder().encode(JSON.stringify(result,null,2)).length>8*1024*1024)fail('完整備份超過 8 MiB，請縮小上傳圖片。');
    return result;
  }
  function migrate(custom,favorites,theme) {
    const warnings=[]; const kept=[]; const seen=new Set();
    for(const c of Array.isArray(custom)?custom:[]) {try {const n=normalize(c,true);if(!n.custom || seen.has(n.id)) throw new Error();seen.add(n.id);kept.push(n);} catch {warnings.push('一筆舊角色格式無效，原儲存資料已保留。');}}
    const ids=new Set([...base,...kept].map(c=>c.id));
    for(const c of kept)c.relationships=c.relationships.filter(r=>ids.has(r.id));
    const state=validate({version:2,custom:kept,overrides:[],favorites:(Array.isArray(favorites)?favorites:[]).filter(id=>ids.has(id)),theme:theme==='dark'?'dark':'light'});
    return {state,warnings};
  }
  function merge(current,incoming) {
    const next=validate(incoming);
    const combine=(a,b)=>[...new Map([...a,...b].map(c=>[c.id,c])).values()];
    return validate({version:2,custom:combine(current.custom,next.custom),overrides:combine(current.overrides,next.overrides),favorites:[...new Set([...current.favorites,...next.favorites])],theme:next.theme});
  }
  window.WikiCore={normalize,resolve,validate,migrate,merge,safeImage,fallback,relationTypes,limits};
})();
