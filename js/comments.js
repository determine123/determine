// Mount comments independently of the audio shell, including client-side navigation.
(()=>{
  let instance=null,observer=null,generation=0,modulePromise=null;
  function library(){
    if(!modulePromise){
      if(!document.getElementById('waline-style')){
        const css=document.createElement('link');css.id='waline-style';css.rel='stylesheet';
        css.href='https://unpkg.com/@waline/client@3/dist/waline.css';document.head.append(css);
      }
      modulePromise=import('https://unpkg.com/@waline/client@3/dist/waline.js').catch(error=>{modulePromise=null;throw error});
    }
    return modulePromise;
  }
  function connect(){
    const token=++generation;observer?.disconnect();instance?.destroy();instance=null;
    const section=document.querySelector('.comment-section');
    if(!section?.dataset.commentServer)return;
    const mount=section.querySelector('.comment-mount'),status=section.querySelector('.comment-status');
    async function load(){
      observer?.disconnect();
      try{
        const {init}=await library();
        if(token!==generation||!section.isConnected)return;
        instance=init({el:mount,serverURL:section.dataset.commentServer,path:section.dataset.commentPath,
          lang:'zh-CN',login:'force',dark:'html[data-theme="night"]',pageview:false,comment:false});
        status.hidden=true;
      }catch{
        if(token!==generation||!section.isConnected)return;
        status.textContent='评论暂时无法加载。';
        const retry=document.createElement('button');retry.textContent='重试';retry.addEventListener('click',()=>{retry.remove();load()},{once:true});status.append(' ',retry);
      }
    }
    if(window.IntersectionObserver){observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))load()},{rootMargin:'200px'});observer.observe(section)}else load();
  }
  connect();document.addEventListener('site:page',connect);
})();
