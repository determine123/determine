(()=>{
 function init(){
  const controls=document.querySelector('[data-timeline-controls]');
  if(controls){
   controls.hidden=false;
   const kind=document.getElementById('timeline-kind'),year=document.getElementById('timeline-year'),query=document.getElementById('timeline-query'),rows=[...document.querySelectorAll('.timeline-entry')],groups=[...document.querySelectorAll('.timeline-year')];
   const params=new URLSearchParams(location.search);
   if([...year.options].some(x=>x.value===params.get('year')))year.value=params.get('year');
   if(['post','essay'].includes(params.get('kind')))kind.value=params.get('kind');
   function render(){
    const term=query.value.trim().toLocaleLowerCase(),filtered=kind.value!=='all'||year.value!=='all'||!!term;
    let count=0;
    rows.forEach(row=>{row.hidden=!(kind.value==='all'||row.dataset.kind===kind.value)||!(year.value==='all'||row.dataset.year===year.value)||!row.querySelector('a').textContent.toLocaleLowerCase().includes(term);if(!row.hidden)count++});
    groups.forEach(group=>{const visible=group.querySelector('.timeline-entry:not([hidden])');group.hidden=!visible;if(filtered&&visible)group.open=true;group.querySelectorAll('.timeline-month').forEach(month=>month.hidden=!month.querySelector('.timeline-entry:not([hidden])'))});
    document.getElementById('timeline-count').textContent='共 '+count+' 条记录';document.getElementById('timeline-empty').hidden=count!==0;
   }
   kind.addEventListener('change',render);year.addEventListener('change',render);query.addEventListener('input',render);
   document.getElementById('timeline-reset').addEventListener('click',()=>{kind.value=year.value='all';query.value='';groups.forEach((group,i)=>group.open=i===0);render()});render();
  }
  document.querySelectorAll('[data-copy-article]').forEach(button=>button.addEventListener('click',async()=>{
   const status=button.parentElement.querySelector('[data-copy-status]'),url=document.querySelector('link[rel="canonical"]')?.href||location.href;
   try{await navigator.clipboard.writeText(url);status.textContent='链接已复制。'}catch{status.replaceChildren();const input=document.createElement('input');input.type='text';input.readOnly=true;input.value=url;input.setAttribute('aria-label','文章链接，请手动复制');status.append(input);input.focus();input.select()}
  }));
 }
 init();document.addEventListener('site:page',init);
})();
