(()=>{
  const panel=document.getElementById('global-music');if(!panel)return;
  const handle=document.getElementById('music-handle'),lock=document.getElementById('music-lock'),reopen=document.getElementById('music-reopen'),position=document.getElementById('music-position'),status=document.getElementById('music-position-status');
  let state={locked:false,closed:false,x:null,y:null,corner:null},drag=null;
  try{Object.assign(state,JSON.parse(localStorage.getItem('determine-music-window'))||{})}catch{}
  function save(){try{localStorage.setItem('determine-music-window',JSON.stringify(state))}catch{}}
  function place(x,y){
    const bounds=panel.getBoundingClientRect();
    state.x=Math.max(12,Math.min(x,window.innerWidth-bounds.width-12));
    state.y=Math.max(12,Math.min(y,window.innerHeight-bounds.height-12));
    panel.style.left=state.x+'px';panel.style.top=state.y+'px';panel.style.bottom='auto';
  }
  function fit(){
    if(panel.hidden)return;
    if(state.corner){const bounds=panel.getBoundingClientRect();place(state.corner.endsWith('right')?window.innerWidth-bounds.width-12:12,state.corner.startsWith('bottom')?window.innerHeight-bounds.height-12:12)}
    else if(Number.isFinite(state.x)&&Number.isFinite(state.y))place(state.x,state.y);
  }
  function update(){
    panel.hidden=!!state.closed;reopen.hidden=!state.closed;
    panel.classList.toggle('is-locked',!!state.locked);
    lock.setAttribute('aria-pressed',String(!!state.locked));lock.setAttribute('aria-label',state.locked?'解除固定，允许拖动':'固定当前位置');lock.title=lock.getAttribute('aria-label');lock.textContent=state.locked?'◆':'◇';
    status.textContent=state.locked?'已固定位置':'悬浮 · 可拖动';position.value=state.corner||'';fit();
  }
  lock.addEventListener('click',()=>{state.locked=!state.locked;update();save()});
  document.getElementById('music-close').addEventListener('click',()=>{document.getElementById('music-audio').pause();state.closed=true;update();save();reopen.focus()});
  reopen.addEventListener('click',()=>{state.closed=false;update();save();document.getElementById('music-play').focus()});
  position.addEventListener('change',()=>{if(!position.value)return;state.corner=position.value;fit();save()});
  handle.addEventListener('pointerdown',event=>{
    if(state.locked||event.button!==0||event.target.closest('button'))return;
    const rect=panel.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top};
    handle.setPointerCapture(event.pointerId);panel.classList.add('is-dragging');event.preventDefault();
  });
  handle.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;state.corner=null;position.value='';place(drag.left+event.clientX-drag.x,drag.top+event.clientY-drag.y)});
  function end(event){if(!drag||event.pointerId!==drag.id)return;drag=null;panel.classList.remove('is-dragging');save()}
  handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
  handle.addEventListener('keydown',event=>{if(event.target!==handle||state.locked)return;const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const d=directions[event.key];if(!d)return;event.preventDefault();const rect=panel.getBoundingClientRect(),step=event.shiftKey?30:10;state.corner=null;place(rect.left+d[0]*step,rect.top+d[1]*step);save()});
  window.addEventListener('resize',fit);
  if(window.ResizeObserver)new ResizeObserver(fit).observe(panel);
  update();if(state.closed)document.getElementById('music-audio').pause();
})();
