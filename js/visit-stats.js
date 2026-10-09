// iBruce's public counter uses JSONP; it does not expose a CORS fetch API.
(()=>{
  const note=document.getElementById('visit-note'),pv=document.getElementById('busuanzi_value_site_pv'),uv=document.getElementById('busuanzi_value_site_uv'),exclude=document.getElementById('stats-exclude'),retry=document.getElementById('stats-retry');
  if(!note||!pv||!uv)return;
  const sessionKey='determine-visit-session-ibruce-v1',lastKey='determine-visit-last-ibruce-v1',opt='determine-stats-excluded';
  let busy=false,disabled=false;
  function read(storage,key){try{return JSON.parse(storage.getItem(key));}catch{return null;}}
  function save(storage,key,value){try{storage.setItem(key,JSON.stringify(value));}catch{}}
  let session,local;
  try{session=window.sessionStorage;}catch{}
  try{local=window.localStorage;disabled=local.getItem(opt)==='1';}catch{}
  function data(value){
    const number=v=>typeof v==='number'?v:(typeof v==='string'&&/^\d+$/.test(v)?Number(v):NaN);
    const views=number(value?.site_pv),visitors=number(value?.site_uv);
    return Number.isSafeInteger(views)&&views>=0&&Number.isSafeInteger(visitors)&&visitors>=0?{site_pv:views,site_uv:visitors}:null;
  }
  function render(value){const d=data(value);if(!d)return false;pv.textContent=d.site_pv.toLocaleString('zh-CN');uv.textContent=d.site_uv.toLocaleString('zh-CN');return true;}
  function controls(){if(retry)retry.disabled=busy||disabled;}
  function request(){
    return new Promise((resolve,reject)=>{
      const callback='determineStats_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      let timer;
      function finish(error,value){clearTimeout(timer);script.remove();delete window[callback];error?reject(error):resolve(value);}
      window[callback]=value=>{const d=data(value);finish(d?null:new Error('format'),d);};
      script.async=true;
      // Only site totals are used. Send the referring origin without article paths.
      script.referrerPolicy='origin';
      script.src='https://busuanzi.ibruce.info/busuanzi?jsonpCallback='+callback;
      script.onerror=()=>finish(new Error('network'));
      timer=setTimeout(()=>finish(new Error('timeout')),12000);
      document.head.appendChild(script);
    });
  }
  async function load(explicit=false){
    if(disabled){note.textContent='本浏览器不参与统计';controls();return;}
    if(busy)return;
    const saved=read(session,sessionKey);
    if(!explicit&&render(saved?.data)){note.textContent='iBruce 统计累计值 · UV 为估计值 · 本标签页缓存';return;}
    const previous=read(local,lastKey);
    const cached=render(previous?.data);
    if(!explicit&&saved?.attemptedAt&&Date.now()-saved.attemptedAt<30000){note.textContent=(cached?'显示最近成功统计 · ':'')+'统计连接失败 · 可手动重试';return;}
    busy=true;controls();
    save(session,sessionKey,{attemptedAt:Date.now()});
    note.textContent=cached?'显示最近成功统计 · 正在更新':'正在连接 iBruce 统计';
    try{
      const d=await request(),record={data:d,at:Date.now()};
      render(d);save(session,sessionKey,record);save(local,lastKey,record);
      note.textContent=disabled?'本浏览器不参与后续统计':'iBruce 统计累计值 · UV 为估计值 · 本标签页缓存';
    }catch(error){
      render(previous?.data);
      note.textContent=disabled?'本浏览器不参与统计':(cached?'显示最近成功统计 · ':'')+(error.message==='timeout'?'统计连接超时':error.message==='format'?'统计数据异常':'统计服务连接失败')+' · 可手动重试';
    }finally{busy=false;controls();}
  }
  if(exclude){exclude.checked=disabled;exclude.addEventListener('change',()=>{disabled=exclude.checked;try{local.setItem(opt,disabled?'1':'0');}catch{}load();});}
  if(retry)retry.addEventListener('click',()=>load(true));
  render(read(session,sessionKey)?.data)||render(read(local,lastKey)?.data);
  load();
})();
