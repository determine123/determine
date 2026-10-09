const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/visit-stats.js'),'utf8');
const sessionKey='determine-visit-session-ibruce-v1';
const lastKey='determine-visit-last-ibruce-v1';
function storage(initial={}){const values=new Map(Object.entries(initial));return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};}
function harness({session=storage(),local=storage(),blocked=false}={}){
  const elements=Object.fromEntries(['visit-note','busuanzi_value_site_pv','busuanzi_value_site_uv','stats-exclude','stats-retry'].map(id=>[id,{textContent:'—',handlers:{},addEventListener(name,fn){this.handlers[name]=fn;}}]));
  const scripts=[],timers=new Map();let id=0;
  const context={document:{getElementById:key=>elements[key],createElement:()=>({remove(){this.removed=true;}}),head:{appendChild:script=>scripts.push(script)}},setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:key=>timers.delete(key)};
  context.window=context;
  if(blocked===true)Object.defineProperty(context,'localStorage',{get(){throw Error('denied');}});else context.localStorage=local;
  if(blocked)Object.defineProperty(context,'sessionStorage',{get(){throw Error('denied');}});else context.sessionStorage=session;
  vm.createContext(context);vm.runInContext(source,context);
  const tick=()=>new Promise(resolve=>setImmediate(resolve));
  const respond=value=>{const callback=new URL(scripts.at(-1).src).searchParams.get('jsonpCallback');context[callback](value);return tick();};
  return {elements,scripts,timers,session,local,context,tick,respond};
}

test('live counters display, persist, and do not count again on refresh',async()=>{
  const h=harness();assert.equal(h.scripts.length,1);assert.equal(h.scripts[0].referrerPolicy,'origin');
  await h.respond({site_pv:1234,site_uv:321});
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'1,234');
  assert.equal(h.elements.busuanzi_value_site_uv.textContent,'321');
  assert.equal(h.timers.size,0);assert.ok(h.scripts[0].removed);
  const refreshed=harness({session:h.session,local:h.local});
  assert.equal(refreshed.scripts.length,0);assert.equal(refreshed.elements.busuanzi_value_site_pv.textContent,'1,234');
});

test('opt out prevents the request and disables retry',()=>{
  const h=harness({local:storage({'determine-stats-excluded':'1'})});
  assert.equal(h.scripts.length,0);assert.ok(h.elements['stats-retry'].disabled);
});

test('network failure keeps explicitly labelled cached values and retry works',async()=>{
  const h=harness({local:storage({[lastKey]:JSON.stringify({data:{site_pv:50,site_uv:20},at:1})})});
  h.scripts[0].onerror();await h.tick();
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'50');
  assert.match(h.elements['visit-note'].textContent,/显示最近成功统计/);
  assert.equal(h.elements['stats-retry'].disabled,false);
  h.elements['stats-retry'].handlers.click();assert.equal(h.scripts.length,2);
  await h.respond({site_pv:51,site_uv:20});assert.equal(h.elements.busuanzi_value_site_pv.textContent,'51');
});

test('timeout without cache preserves empty values and clears callbacks',async()=>{
  const h=harness();const script=h.scripts[0];
  const callback=new URL(script.src).searchParams.get('jsonpCallback');
  [...h.timers.values()][0]();await h.tick();
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'—');
  assert.match(h.elements['visit-note'].textContent,/统计连接超时/);
  assert.equal(h.context[callback],undefined);assert.ok(script.removed);
});

test('invalid data never masquerades as a successful count',async()=>{
  const h=harness();await h.respond({site_pv:null,site_uv:24});
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'—');
  assert.match(h.elements['visit-note'].textContent,/统计数据异常/);
  assert.equal(h.local.getItem(lastKey),null);
});

test('blocked storage still allows live results',async()=>{
  const h=harness({blocked:true});await h.respond({site_pv:'12',site_uv:'10'});
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'12');
});

test('old provider cache is never added to new provider results',async()=>{
  const h=harness({session:storage({'determine-visit-session-v3':JSON.stringify({data:{busuanzi_site_pv:1000,busuanzi_site_uv:1000}})})});
  await h.respond({site_pv:26,site_uv:24});
  assert.equal(h.elements.busuanzi_value_site_pv.textContent,'26');
});

test('opt out is still honoured when only session storage is blocked',()=>{
  const h=harness({blocked:'session',local:storage({'determine-stats-excluded':'1'})});
  assert.equal(h.scripts.length,0);
});

test('opting out during an in-flight request keeps the opt-out status',async()=>{
  const h=harness();h.elements['stats-exclude'].checked=true;
  h.elements['stats-exclude'].handlers.change();h.scripts[0].onerror();await h.tick();
  assert.equal(h.elements['visit-note'].textContent,'本浏览器不参与统计');
  assert.ok(h.elements['stats-retry'].disabled);
});
