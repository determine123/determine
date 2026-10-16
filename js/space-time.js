(()=>{
  const canvas=document.getElementById('space-cosmos');
  if(!canvas||!canvas.getContext)return;
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer={x:-1000,y:-1000,active:false};
  const ripples=[];
  let width=0,height=0,scale=1,stars=[],frame=0,lastFrame=0,visible=true;
  const random=(min,max)=>min+Math.random()*(max-min);

  function resize(){
    scale=Math.min(window.devicePixelRatio||1,1.5);
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ctx.setTransform(scale,0,0,scale,0,0);
    const count=Math.min(width<600?78:150,Math.max(48,Math.round(width*height/(width<600?8500:10500))));
    stars=Array.from({length:count},()=>({x:random(0,width),y:random(0,height),r:random(.45,1.55),phase:random(0,Math.PI*2),speed:random(.00045,.0013),drift:random(-.08,.08),warm:Math.random()<.2}));
    draw(performance.now());
  }
  function draw(now){
    ctx.clearRect(0,0,width,height);
    const night=document.documentElement.dataset.theme==='night';
    const parallaxX=pointer.active?(pointer.x/width-.5)*5:0;
    const parallaxY=pointer.active?(pointer.y/height-.5)*4:0;
    for(const star of stars){
      const alpha=reduceMotion.matches ? .94 :(.58+.4*(.5+.5*Math.sin(now*star.speed+star.phase)));
      const x=star.x+parallaxX+Math.sin(now*.00012+star.phase)*star.drift*6;
      const y=star.y+parallaxY+Math.cos(now*.00011+star.phase)*star.drift*5;
      ctx.beginPath();ctx.fillStyle=star.warm?(night?`rgba(246,199,143,${alpha})`:`rgba(142,112,77,${alpha*.65})`):(night?`rgba(177,220,239,${alpha})`:`rgba(79,130,155,${alpha*.64})`);
      ctx.arc(x,y,star.r,0,Math.PI*2);ctx.fill();
      if(pointer.active){
        const dx=pointer.x-x,dy=pointer.y-y,distance=Math.hypot(dx,dy);
        if(distance<142){ctx.beginPath();ctx.strokeStyle=night?`rgba(120,202,224,${(1-distance/142)*.22})`:`rgba(91,188,214,${(1-distance/142)*.19})`;ctx.lineWidth=.8;ctx.moveTo(x,y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke()}
      }
    }
    if(pointer.active){
      const glow=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,145);
      glow.addColorStop(0,night?'rgba(69,156,184,.075)':'rgba(56,139,166,.055)');glow.addColorStop(1,'rgba(60,130,150,0)');
      ctx.fillStyle=glow;ctx.fillRect(pointer.x-145,pointer.y-145,290,290);
    }
    if(!reduceMotion.matches){
      for(let i=ripples.length-1;i>=0;i--){
        const progress=(now-ripples[i].started)/720;
        if(progress>=1){ripples.splice(i,1);continue}
        ctx.beginPath();ctx.arc(ripples[i].x,ripples[i].y,8+progress*76,0,Math.PI*2);
        ctx.strokeStyle=`rgba(127,228,238,${(1-progress)*.48})`;ctx.lineWidth=1.25-progress*.55;
        ctx.shadowColor='#7fe4ee';ctx.shadowBlur=12*(1-progress);ctx.stroke();ctx.shadowBlur=0;
      }
    }
  }
  function animate(now){
    if(!visible||reduceMotion.matches){frame=0;draw(now);return}
    if(now-lastFrame>40){draw(now);lastFrame=now}
    frame=requestAnimationFrame(animate);
  }
  function start(){if(!visible)return;if(frame)cancelAnimationFrame(frame);frame=reduceMotion.matches?0:requestAnimationFrame(animate);if(reduceMotion.matches)draw(performance.now())}
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){pointer.x=event.clientX;pointer.y=event.clientY;pointer.active=true}},{passive:true});
  window.addEventListener('pointerdown',event=>{if(!reduceMotion.matches){ripples.push({x:event.clientX,y:event.clientY,started:performance.now()});if(ripples.length>4)ripples.shift()}},{passive:true});
  window.addEventListener('pointerleave',()=>{pointer.active=false},{passive:true});
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else if(frame){cancelAnimationFrame(frame);frame=0}});
  reduceMotion.addEventListener?.('change',start);
  resize();start();
})();
