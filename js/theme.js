(()=>{
 const root=document.documentElement,system=matchMedia('(prefers-color-scheme: dark)');let mode='system';
 try{const saved=localStorage.getItem('determine-theme');if(['day','night','system'].includes(saved))mode=saved}catch{}
 const button=document.getElementById('theme-toggle');
 function apply(){const night=mode==='night'||(mode==='system'&&system.matches);root.dataset.theme=night?'night':'day';if(button){button.textContent=mode==='system'?'◐ Auto':night?'☾ Dark':'☀ Light';button.setAttribute('aria-pressed',String(night));button.setAttribute('aria-label',(mode==='system'?'跟随系统':night?'当前深色':'当前浅色')+'，点击切换主题偏好')}}
 apply();button?.addEventListener('click',()=>{const modes=['day','night','system'];mode=modes[(modes.indexOf(mode)+1)%modes.length];try{localStorage.setItem('determine-theme',mode)}catch{}apply()});system.addEventListener('change',()=>{if(mode==='system')apply()});
})();
