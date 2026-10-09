const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/site-statistics.js'),'utf8');
function harness(response){
  const target={textContent:'—',isConnected:true};
  const buttons=[];
  const status={textContent:'',append(...items){buttons.push(...items.filter(x=>typeof x==='object'));}};
  const card={dataset:{statCommentServer:'https://comments.example'},querySelector:key=>key.includes('status')?status:target};
  const events={},calls=[];
  const context={AbortController,setTimeout,clearTimeout,fetch:async(url,options)=>{calls.push({url,options});if(response instanceof Error)throw response;return {ok:true,json:async()=>response};},document:{querySelector:()=>card,addEventListener:(name,fn)=>events[name]=fn,createElement:()=>({remove(){},addEventListener(name,fn){this[name]=fn;}})}};
  vm.createContext(context);vm.runInContext(source,context);
  return {target,status,events,calls,buttons,tick:()=>new Promise(resolve=>setImmediate(resolve))};
}
test('whole-site total is fetched once and reused during navigation',async()=>{
  const h=harness({errno:0,data:3});await h.tick();
  assert.equal(h.target.textContent,'3');
  assert.equal(h.calls[0].url,'https://comments.example/api/comment?type=count');
  assert.equal(h.calls[0].options.credentials,'omit');
  h.events['site:page']();await h.tick();assert.equal(h.calls.length,1);
});
test('a real zero is displayed as zero',async()=>{
  const h=harness({errno:0,data:0});await h.tick();assert.equal(h.target.textContent,'0');
});
test('invalid responses and network failures remain unknown, never fabricated',async()=>{
  for(const response of [{errno:1,data:228},{errno:0,data:null},new Error('offline')]){
    const h=harness(response);await h.tick();assert.equal(h.target.textContent,'—');
    assert.equal(h.buttons.length,1);assert.match(h.status.textContent,/暂不可用/);
  }
});
