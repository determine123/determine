(()=>{
let active=null,library=null;
function loadMap(){if(window.L)return Promise.resolve();if(library)return library;library=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=document.getElementById('page-content').dataset.base+'js/leaflet.js';script.onload=resolve;script.onerror=()=>{library=null;script.remove();reject(Error('地图组件加载失败'));};document.head.append(script);});return library;}
async function init(){
 if(active){active.abort.abort();active.map?.remove();active=null;}
 const root=document.querySelector('[data-footprints]');if(!root)return;
 const state={abort:new AbortController(),map:null};active=state;
 const $=id=>root.querySelector('#'+id),base=document.getElementById('page-content').dataset.base;
 const cities=[{name:'上海',lat:31.23,lng:121.47},{name:'杭州',lat:30.27,lng:120.15},{name:'苏州',lat:31.30,lng:120.58},{name:'宁波',lat:29.87,lng:121.55}];
 loadMap().then(()=>{
   if(active!==state)return;
   const map=L.map($('fp-map'),{scrollWheelZoom:false});state.map=map;
   const layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
   layer.on('tileerror',()=>{$('fp-map-note').textContent='地图底图暂时无法加载；城市列表与照片仍可浏览。';});
   const markers=cities.map(c=>L.circleMarker([c.lat,c.lng],{radius:9,color:'#fff',weight:3,fillColor:'#20685d',fillOpacity:1}).addTo(map).bindPopup(c.name+' · 城市概略位置<br>相册：江浙沪<br>具体地标见照片说明，部分地点尚待核对'));
   map.fitBounds(cities.map(c=>[c.lat,c.lng]),{padding:[40,40]});
   root.querySelectorAll('[data-city]').forEach(button=>button.addEventListener('click',()=>{const i=cities.findIndex(c=>c.name===button.dataset.city);map.setView([cities[i].lat,cities[i].lng],10);markers[i].openPopup();}));
 }).catch(()=>{if(active===state)$('fp-map-note').textContent='地图组件暂未加载成功，可先浏览相册。';});
 try{
 const response=await fetch(root.dataset.source,{signal:state.abort.signal});if(!response.ok)throw Error();const data=await response.json();if(active!==state)return;
 const photos=data.photos;photos.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.label.localeCompare(b.label));$('fp-total').textContent=photos.length;
 const years=[...new Set(photos.map(p=>p.date?.slice(0,4)).filter(Boolean))].sort().reverse();years.forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;$('fp-year').append(o);});
 let list=photos,shown=0,index=0;const box=$('fp-lightbox');
 function open(i){index=i;const p=list[i];$('fp-large').src=base+p.image;$('fp-large').alt=p.album+' · '+(p.date||'日期待确认');$('fp-caption').textContent=p.album+' · '+(p.date||'日期待确认')+' · '+(p.place?(p.city+' / '+p.place+' · 画面识别待核对'):'具体地点待确认');$('fp-position').textContent=(i+1)+' / '+list.length;if(!box.open)box.showModal();}
 function more(){const chunk=list.slice(shown,shown+32);chunk.forEach((p,offset)=>{const i=shown+offset,button=document.createElement('button'),img=document.createElement('img'),caption=document.createElement('span');button.className='fp-card';button.setAttribute('aria-label','查看 '+p.album+' '+(p.date||'日期待确认')+' 照片');img.src=base+p.image;img.alt=p.album+'照片';img.loading='lazy';img.decoding='async';img.width=p.width;img.height=p.height;caption.textContent=(p.date||'日期待确认')+(p.place?' · '+p.place:'');button.append(img,caption);button.addEventListener('click',()=>open(i));$('fp-grid').append(button);});shown+=chunk.length;$('fp-more').hidden=shown>=list.length;$('fp-state').textContent='共 '+list.length+' 张 · 已展示 '+shown+' 张'+(list.length===0?' · 此城市尚无已定位照片':'');}
 $('fp-more').onclick=more;$('fp-year').onchange=()=>{list=photos.filter(p=>(!$('fp-year').value||p.date?.startsWith($('fp-year').value))&&(!$('fp-city').value||($('fp-city').value==='unknown'?!p.city:p.city===$('fp-city').value)));shown=0;$('fp-grid').replaceChildren();more();};
 $('fp-city').onchange=()=>{$('fp-year').onchange();};$('fp-close').onclick=()=>box.close();$('fp-prev').onclick=()=>open((index-1+list.length)%list.length);$('fp-next').onclick=()=>open((index+1)%list.length);box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('fp-prev').click();if(e.key==='ArrowRight')$('fp-next').click();});box.addEventListener('click',e=>{if(e.target===box)box.close();});more();
 }catch(e){if(active===state&&e.name!=='AbortError')$('fp-state').textContent='相册加载失败，请刷新页面重试。';}
}
document.addEventListener('site:page',init);init();
})();
