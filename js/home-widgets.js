(()=>{
 let recordsPromise;
 function init(){
  const root=document.getElementById('writing-calendar');if(!root)return;
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const values=Object.fromEntries(parts.map(x=>[x.type,x.value]));const today=values.year+'-'+values.month+'-'+values.day;
  let year=Number(values.year),month=Number(values.month)-1,records=new Map(),failed=false;
  const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
  function render(){
   if(!root.isConnected)return;root.replaceChildren();
   const bar=make('div');bar.className='calendar-nav';
   const prev=make('button','‹'),next=make('button','›'),label=make('strong',year+' 年 '+(month+1)+' 月');
   prev.type=next.type='button';prev.setAttribute('aria-label','上个月');next.setAttribute('aria-label','下个月');
   const shift=delta=>{const d=new Date(Date.UTC(year,month+delta,1));year=d.getUTCFullYear();month=d.getUTCMonth();render()};
   prev.addEventListener('click',()=>shift(-1));next.addEventListener('click',()=>shift(1));bar.append(prev,label,next);root.append(bar);
   const table=make('table');table.className='writing-calendar';table.setAttribute('aria-label',year+'年'+(month+1)+'月写作日历');
   const header=make('thead'),headrow=make('tr');for(const name of ['日','一','二','三','四','五','六']){const th=make('th',name);th.scope='col';headrow.append(th)}header.append(headrow);table.append(header);
   const body=make('tbody'),first=new Date(Date.UTC(year,month,1)).getUTCDay(),days=new Date(Date.UTC(year,month+1,0)).getUTCDate();
   for(let offset=0;offset<Math.ceil((first+days)/7)*7;offset+=7){const tr=make('tr');for(let col=0;col<7;col++){
    const td=make('td'),day=offset+col-first+1;
    if(day>0&&day<=days){const date=String(year).padStart(4,'0')+'-'+String(month+1).padStart(2,'0')+'-'+String(day).padStart(2,'0'),entries=records.get(date)||[],el=make(entries.length?'a':'span',String(day));
     if(entries.length){el.href=entries[0].url;el.title=entries.length+' 篇记录：'+entries[0].title;el.setAttribute('aria-label',date+'，'+entries.length+'篇记录，打开最新一篇');el.className='has-entry'}
     if(date===today){el.classList.add('is-today');el.setAttribute('aria-current','date')}td.append(el)
    }tr.append(td)
   }body.append(tr)}table.append(body);root.append(table);
   const foot=make('div');foot.className='calendar-foot';const reset=make('button','回到本月');reset.type='button';reset.addEventListener('click',()=>{year=Number(values.year);month=Number(values.month)-1;render()});foot.append(make('span',failed?'记录暂不可用':'带点日期可打开当天记录'),reset);root.append(foot);
  }
  render();
  async function load(){
   try{if(!recordsPromise)recordsPromise=fetch(root.dataset.calendarUrl).then(r=>{if(!r.ok)throw Error('Calendar unavailable');return r.json()}).catch(e=>{recordsPromise=null;throw e});const data=await recordsPromise;
    for(const item of data){if(!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||!item.url?.startsWith('/'))continue;if(!records.has(item.date))records.set(item.date,[]);records.get(item.date).push(item)}
   }catch{failed=true}render()
  }
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){observer.disconnect();load()}},{rootMargin:'100px'});observer.observe(root)}else load();
 }
 init();document.addEventListener('site:page',init);
})();
