(()=>{
 const uptime=document.getElementById('site-uptime'),updated=document.getElementById('site-updated'),date=document.getElementById('site-updated-date');
 const uptimeDays=[...document.querySelectorAll('[data-site-uptime-days]')],dateCopies=[...document.querySelectorAll('[data-site-updated-date]')];
 if(!uptime||!updated||!date)return;
 let data;
 const elapsed=ms=>{const s=Math.max(0,Math.floor(ms/1000));return Math.floor(s/86400)+' 天 '+String(Math.floor(s/3600)%24).padStart(2,'0')+' 时 '+String(Math.floor(s/60)%60).padStart(2,'0')+' 分 '+String(s%60).padStart(2,'0')+' 秒';};
 function render(){if(!data||document.hidden)return;const running=Date.now()-Date.parse(data.startedAt);uptime.textContent=elapsed(running);updated.textContent=elapsed(Date.now()-Date.parse(data.updatedAt));uptimeDays.forEach(node=>node.textContent=Math.max(0,Math.floor(running/86400000)).toLocaleString('zh-CN'));}
 fetch(uptime.dataset.source,{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('metadata');return r.json();}).then(d=>{
  if(!Number.isFinite(Date.parse(d.startedAt))||!Number.isFinite(Date.parse(d.updatedAt)))throw Error('dates');
  data=d;const updatedDate=new Date(d.updatedAt);date.dateTime=d.updatedAt;date.textContent=updatedDate.toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false});dateCopies.forEach(node=>{node.dateTime=d.updatedAt;node.textContent=updatedDate.toLocaleDateString('en-US',{timeZone:'Asia/Shanghai',month:'short',day:'numeric',year:'numeric'});});
  uptime.title='从首次成功 Pages 部署记录起计，不表示全程无故障';updated.title='最近源码提交 '+d.commit;render();
 }).catch(()=>{uptime.textContent='暂不可用';updated.textContent='暂不可用';date.textContent='暂不可用';uptimeDays.forEach(node=>node.textContent='—');});
 setInterval(render,1000);document.addEventListener('visibilitychange',render);
})();
