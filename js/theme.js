(()=>{
  const root=document.documentElement;
  let saved=null;try{saved=localStorage.getItem('determine-theme')}catch{}
  if(!root.dataset.theme)root.dataset.theme=saved==='night'||saved==='day'?saved:(window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day');
  function connect(){
    const button=document.getElementById('theme-toggle');if(!button)return;
    function update(){const night=root.dataset.theme==='night';button.textContent=night?'☾ 极夜':'☀ 极昼';button.setAttribute('aria-pressed',String(night));button.setAttribute('aria-label',night?'当前极夜，切换到极昼':'当前极昼，切换到极夜')}
    update();button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='night'?'day':'night';try{localStorage.setItem('determine-theme',root.dataset.theme)}catch{}update()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
})();
