(()=>{
 const note=document.getElementById('visit-note'),pv=document.getElementById('busuanzi_value_site_pv'),uv=document.getElementById('busuanzi_value_site_uv'),exclude=document.getElementById('stats-exclude'),retry=document.getElementById('stats-retry');
 if(!note||!pv||!uv)return;
 const key='determine-visit-session-v3',opt='determine-stats-excluded';let busy=false,disabled=false;
 function read(){try{return JSON.parse(sessionStorage.getItem(key));}catch{return null;}}
 function save(v){try{sessionStorage.setItem(key,JSON.stringify(v));}catch{}}
 function render(d){const views=d?.busuanzi_site_pv,visitors=d?.busuanzi_site_uv;if(!Number.isSafeInteger(views)||views<0||!Number.isSafeInteger(visitors)||visitors<0)return false;pv.textContent=views.toLocaleString('zh-CN');uv.textContent=visitors.toLocaleString('zh-CN');note.textContent='统计服务累计值 · UV 为估计值 · 本标签页缓存';return true;}
 try{disabled=localStorage.getItem(opt)==='1';localStorage.removeItem('determine-visit-stats-v2');}catch{}
 async function load(explicit=false){
  if(busy)return;if(disabled){note.textContent='本浏览器不参与统计';return;}
  const saved=read();if(!explicit&&saved){if(!render(saved.data))note.textContent='本标签页已尝试统计 · 可手动重试';return;}
  busy=true;save({attempted:true});const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{const r=await fetch('https://cdn.busuanzi.cc/api.php',{method:'POST',body:JSON.stringify({url:location.origin+location.pathname,referrer:''}),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});if(!r.ok)throw Error('statistics');const d=await r.json();if(!render(d))throw Error('format');save({attempted:true,data:d});if(disabled)note.textContent='本浏览器不参与后续统计';}
  catch{note.textContent='统计暂不可用 · 可手动重试';}
  finally{busy=false;clearTimeout(timer);}
 }
 if(exclude){exclude.checked=disabled;exclude.addEventListener('change',()=>{disabled=exclude.checked;try{localStorage.setItem(opt,disabled?'1':'0');}catch{}load();});}
 if(retry)retry.addEventListener('click',()=>load(true));
 render(read()?.data);load();
})();