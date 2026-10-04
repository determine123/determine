(()=>{
 const key='determine-reading-history';let current=null,scheduled=false;
 const make=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el};
 const bar=make('div');bar.className='reading-progress';bar.hidden=true;bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','文章阅读进度');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');const fill=make('span');bar.append(fill);document.body.append(bar);
 const top=make('button','↑');top.type='button';top.className='back-to-top';top.hidden=true;top.setAttribute('aria-label','回到顶部');top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));document.body.append(top);
 function history(){try{const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data.filter(x=>typeof x.url==='string'&&x.url.startsWith('/')&&typeof x.title==='string').slice(0,8):[]}catch{return []}}
 function progress(){scheduled=false;top.hidden=window.scrollY<500;if(!current?.isConnected){bar.hidden=true;return}bar.hidden=false;const rect=current.getBoundingClientRect(),start=rect.top+window.scrollY,range=Math.max(1,current.offsetHeight-window.innerHeight),value=Math.max(0,Math.min(100,(window.scrollY-start)/range*100));fill.style.transform='scaleX('+value/100+')';bar.setAttribute('aria-valuenow',String(Math.round(value)))}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress)}},{passive:true});window.addEventListener('resize',progress);
 function init(){
  current=document.querySelector('article[data-reading]');
  if(current){
   const body=current.querySelector('.reading-content'),heading=current.querySelector('h1');
   if(body&&heading){
    const text=body.textContent||'',chinese=(text.match(/[\u3400-\u9fff]/g)||[]).length,words=(text.match(/[A-Za-z0-9]+/g)||[]).length,minutes=Math.max(1,Math.ceil(chinese/400+words/220));
    const estimate=make('p','约 '+minutes+' 分钟阅读');estimate.className='reading-estimate';current.querySelector('.post-meta')?.after(estimate);
    const headings=[...body.querySelectorAll('h2,h3')];
    if(headings.length>=2){const toc=make('details');toc.className='reading-toc';toc.append(make('summary','文章目录 · '+headings.length+' 节'));const list=make('ol');headings.forEach((h,i)=>{if(!h.id||document.getElementById(h.id)!==h)h.id='reading-section-'+i;const item=make('li'),link=make('a',h.textContent);link.href='#'+encodeURIComponent(h.id);if(h.tagName==='H3')item.className='toc-sub';item.append(link);list.append(item)});toc.append(list);body.before(toc)}
    try{const record={url:location.pathname,title:heading.textContent.trim().slice(0,150)},rows=history().filter(x=>x.url!==record.url);localStorage.setItem(key,JSON.stringify([record,...rows].slice(0,8)))}catch{}
   }
  }
  const panel=document.getElementById('reading-history');
  if(panel){panel.replaceChildren();const rows=history();if(!rows.length)panel.append(make('p','还没有阅读足迹。记录仅保存在本机。'));for(const row of rows){const link=make('a',row.title);link.href=row.url;panel.append(link)}document.getElementById('reading-history-clear')?.addEventListener('click',()=>{try{localStorage.removeItem(key)}catch{}panel.replaceChildren(make('p','阅读足迹已清除。'))})}
  const more=document.getElementById('moments-more');more?.addEventListener('click',()=>{const remaining=[...document.querySelectorAll('.moment-entry[hidden]')];remaining.slice(0,12).forEach(x=>x.hidden=false);more.hidden=remaining.length<=12});progress();
 }
 init();document.addEventListener('site:page',init);
})();
