// Count actual page visits; retries may be counted by the provider. No timed polling.
(()=>{
 const note=document.getElementById('visit-note'),pv=document.getElementById('busuanzi_value_site_pv'),uv=document.getElementById('busuanzi_value_site_uv');
 if(!note||!pv||!uv)return;
 let busy=false,attempts=0,hasData=false,retryTimer;
 function load(){
  if(busy)return;busy=true;attempts++;
  const callback='determineVisits_'+Date.now()+'_'+Math.random().toString(36).slice(2);
  const script=document.createElement('script');let timeout;
  function cleanup(){clearTimeout(timeout);script.remove();delete window[callback];busy=false}
  function fail(){cleanup();note.textContent=hasData?'手动基数 + 上次统计值 · 连接中断，稍后更新':'手动展示基数（非实测） · 真实统计暂未连接';if(attempts<3)retryTimer=setTimeout(load,15000*attempts)}
  window[callback]=data=>{
   const views=Number(data.site_pv),visitors=Number(data.site_uv);
   if(!Number.isSafeInteger(views)||views<0||!Number.isSafeInteger(visitors)||visitors<0){fail();return}
   cleanup();clearTimeout(retryTimer);hasData=true;attempts=0;
   pv.textContent=(1000+views).toLocaleString('zh-CN')+'+';uv.textContent=(1000+visitors).toLocaleString('zh-CN')+'+';
   note.textContent='手动基数 1000 + 不蒜子累计值 · 访客数为估计值 · '+new Date().toLocaleTimeString('zh-CN',{hour12:false})+' 更新';
  };
  script.src='https://busuanzi.ibruce.info/busuanzi?jsonpCallback='+callback;
  script.referrerPolicy='no-referrer-when-downgrade';script.async=true;script.onerror=fail;
  timeout=setTimeout(fail,15000);document.head.append(script);
 }
 window.addEventListener('online',()=>{attempts=0;clearTimeout(retryTimer);load()});
 document.addEventListener('site:page',()=>{attempts=0;clearTimeout(retryTimer);load()});
 load();
})();
