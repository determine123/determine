// Keep the global audio element alive while replacing only page content.
(()=>{
  const content=document.getElementById('page-content');
  if(!content||!window.fetch||!window.DOMParser)return;
  const base=content.dataset.base;
  let request=null;
  const pages=new Map(),pending=new Map(),ttl=5*60*1000;
  function key(url){const source=new URL(url.href);source.hash='';source.searchParams.set('_site',content.dataset.version||'global-music');return source.href}
  async function read(url){
    const href=key(url),saved=pages.get(href);
    if(saved&&Date.now()-saved.time<ttl)return saved.html;
    if(pending.has(href))return pending.get(href);
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    const task=(async()=>{
      try{
        const response=await fetch(href,{signal:controller.signal,cache:'default'});
        if(!response.ok)throw new Error('Page unavailable');
        const html=await response.text();
        if(!new DOMParser().parseFromString(html,'text/html').querySelector('#page-content, main.page-wrap, main.board'))throw new Error('Page unavailable');
        pages.delete(href);pages.set(href,{html,time:Date.now()});
        if(pages.size>20)pages.delete(pages.keys().next().value);
        return html;
      }finally{clearTimeout(timer);pending.delete(href)}
    })();
    pending.set(href,task);return task;
  }
  const notice=document.createElement('div');notice.className='navigation-notice';notice.hidden=true;notice.setAttribute('role','status');
  const message=document.createElement('span'),retry=document.createElement('button');retry.textContent='重试';notice.append(message,retry);document.body.append(notice);
  let failed=null;retry.addEventListener('click',()=>{if(failed)navigate(failed.url,failed.push)});
  function eligible(url){return url.origin===location.origin&&url.pathname.startsWith(base)&&!url.pathname.match(/\.[a-z0-9]+$/i)}
  async function navigate(url,push){
    request?.abort();
    const controller=new AbortController();request=controller;
    notice.hidden=true;
    content.setAttribute('aria-busy','true');
    try{
      const page=new DOMParser().parseFromString(await read(url),'text/html');
      if(controller.signal.aborted||request!==controller)return;
      let next=page.getElementById('page-content');
      // An older cached article still has the same main content layout.
      if(!next&&page.querySelector('main.page-wrap')){next=page.createElement('div');next.append(page.querySelector('main.page-wrap'))}
      if(!next&&page.querySelector('main.board')){next=page.createElement('div');const intro=page.querySelector('.intro');if(intro)next.append(intro);next.append(page.querySelector('main.board'));next.querySelector('.music-card')?.remove()}
      if(!next)throw new Error('Page unavailable');
      document.getElementById('search-dialog')?.close();
      content.replaceChildren(...next.childNodes);
      document.title=page.title;
      for(const selector of ['link[rel="canonical"]','meta[name="description"]']){
        const incoming=page.querySelector(selector),current=document.querySelector(selector);
        if(incoming&&current){for(const attr of ['href','content'])if(incoming.hasAttribute(attr))current.setAttribute(attr,incoming.getAttribute(attr))}
      }
      if(push)history.pushState({},'',url.href);
      document.dispatchEvent(new Event('site:page'));
      const target=url.hash?document.getElementById(decodeURIComponent(url.hash.slice(1))):null;
      if(target)target.scrollIntoView();else window.scrollTo({top:0,behavior:'instant'});
      content.setAttribute('tabindex','-1');content.focus({preventScroll:true});
    }catch(error){
      if(controller.signal.aborted||request!==controller)return;
      // Never reload the document on a transient navigation failure: that stops audio.
      failed={url,push};message.textContent='页面暂未加载成功，音乐继续播放。';notice.hidden=false;
    }
    finally{if(request===controller)content.removeAttribute('aria-busy')}
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const url=new URL(link.href,location.href);
    if(!eligible(url)||(url.pathname===location.pathname&&url.search===location.search))return;
    event.preventDefault();navigate(url,true);
  });
  let preloadTimer=null;
  function preload(event){
    const connection=window.navigator?.connection;
    if(connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType||''))return;
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const url=new URL(link.href,location.href);
    if(!eligible(url)||url.pathname===location.pathname)return;
    clearTimeout(preloadTimer);
    preloadTimer=setTimeout(()=>{if(pending.size<2)read(url).catch(()=>{})},120);
  }
  document.addEventListener('pointerover',preload);
  document.addEventListener('focusin',preload);
  window.addEventListener('popstate',()=>navigate(new URL(location.href),false));
})();
