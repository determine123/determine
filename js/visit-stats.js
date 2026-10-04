// Real provider totals plus the owner's explicitly configured display baseline.
(()=>{
 const note=document.getElementById('visit-note'),pv=document.getElementById('busuanzi_value_site_pv'),uv=document.getElementById('busuanzi_value_site_uv');
 if(!note||!pv||!uv)return;
 const baseline=1000,key='determine-visit-stats-v2';let busy=false,attempts=0,retryTimer,last=null;
 function render(data,cached=false){
  const views=Number(data.busuanzi_site_pv),visitors=Number(data.busuanzi_site_uv);
  if(!Number.isSafeInteger(views)||views<0||!Number.isSafeInteger(visitors)||visitors<0)return false;
  last=data;pv.textContent=(baseline+views).toLocaleString('zh-CN')+'+';uv.textContent=(baseline+visitors).toLocaleString('zh-CN')+'+';
  note.textContent='基数 1000 + 实际累计统计 · 访客数为估计值'+(cached?' · 上次成功结果':' · '+new Date().toLocaleTimeString('zh-CN',{hour12:false})+' 更新');return true;
 }
 try{const cached=JSON.parse(localStorage.getItem(key));if(cached)render(cached,true)}catch{}
 async function load(){
  if(busy)return;busy=true;attempts++;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch('https://cdn.busuanzi.cc/api.php',{method:'POST',body:JSON.stringify({url:location.origin+location.pathname,referrer:''}),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
   if(!response.ok)throw Error('Statistics unavailable');
   const data=await response.json();if(!render(data))throw Error('Invalid statistics');
   try{localStorage.setItem(key,JSON.stringify(data))}catch{}
   attempts=0;clearTimeout(retryTimer);
  }catch{
   if(last)render(last,true);else note.textContent='基数 1000（非实测） · 正在重连统计服务';
   if(attempts<3)retryTimer=setTimeout(load,15000*attempts);
  }finally{clearTimeout(timeout);busy=false}
 }
 window.addEventListener('online',()=>{attempts=0;clearTimeout(retryTimer);load()});
 document.addEventListener('site:page',()=>{attempts=0;clearTimeout(retryTimer);load()});
 load();
})();
