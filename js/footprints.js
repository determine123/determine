(()=>{
let active=null,library=null;
function loadMap(){if(window.L)return Promise.resolve();if(library)return library;library=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=document.getElementById('page-content').dataset.base+'js/leaflet.js';script.onload=resolve;script.onerror=()=>{library=null;script.remove();reject(Error('地图组件加载失败'));};document.head.append(script);});return library;}
async function init(){
 if(active){active.abort.abort();active.map?.remove();active=null;}
 const root=document.querySelector('[data-footprints]');if(!root)return;
 const state={abort:new AbortController(),map:null};active=state;
 const $=id=>root.querySelector('#'+id),base=document.getElementById('page-content').dataset.base;
 const cities=[{name:'上海',lat:31.23,lng:121.47},{name:'杭州',lat:30.27,lng:120.15},{name:'苏州',lat:31.30,lng:120.58},{name:'宁波',lat:29.87,lng:121.55}];
 const dataPromise=fetch(root.dataset.source,{signal:state.abort.signal}).then(response=>{if(!response.ok)throw Error('相册数据加载失败');return response.json();});
 Promise.all([loadMap(),dataPromise]).then(([,data])=>{
   if(active!==state)return;
   const map=L.map($('fp-map'),{scrollWheelZoom:false});state.map=map;
   const layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
   layer.on('tileerror',()=>{$('fp-map-note').textContent='地图底图暂时无法加载；城市列表与照片仍可浏览。';});
   const covers={'上海':'3ce232b2287f4959cd1b','杭州':'8fd78b87aea965db8ac6','苏州':'e080314c61074f1e07db','宁波':'2b72bc9ec62a9c17c05b'};
   const markers=cities.map(c=>{
     const photo=data.photos.find(p=>p.id===covers[c.name]&&p.city===c.name)||data.photos.find(p=>p.city===c.name);
     const iconNode=document.createElement('div'),label=document.createElement('span');iconNode.className='fp-photo-pin';label.textContent=c.name;
     if(photo){const thumbnail=document.createElement('img');thumbnail.src=base+photo.image;thumbnail.alt=c.name+'代表照片';iconNode.append(thumbnail);}iconNode.append(label);
     const popup=document.createElement('div');popup.className='fp-map-popup';
     const title=document.createElement('strong');title.textContent=c.name+' · '+(photo?.place||'城市足迹');popup.append(title);
     if(photo){const button=document.createElement('button'),image=document.createElement('img');button.className='fp-map-photo';button.setAttribute('aria-label','查看'+c.name+'代表照片大图');image.src=base+photo.image;image.alt=photo.place||c.name;button.append(image);button.addEventListener('click',()=>{if(active===state)state.openPhoto?.(photo.id);});popup.append(button);}
     const note=document.createElement('p');note.textContent='相册：江浙沪 · 点位为城市概略位置。照片地点按画面识别，待核对。';popup.append(note);
     return L.marker([c.lat,c.lng],{title:c.name+'代表照片',alt:c.name+'代表照片',icon:L.divIcon({html:iconNode,className:'fp-photo-marker',iconSize:[64,82],iconAnchor:[32,70],popupAnchor:[0,-65]})}).addTo(map).bindPopup(popup,{maxWidth:280});
   });
   map.fitBounds(cities.map(c=>[c.lat,c.lng]),{padding:[65,65]});
   root.querySelectorAll('[data-city]').forEach(button=>button.addEventListener('click',()=>{const i=cities.findIndex(c=>c.name===button.dataset.city);map.setView([cities[i].lat,cities[i].lng],10);markers[i].openPopup();}));
 }).catch(()=>{if(active===state)$('fp-map-note').textContent='地图组件暂未加载成功，可先浏览相册。';});
 try{
 const data=await dataPromise;if(active!==state)return;
 const photos=data.photos;photos.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.label.localeCompare(b.label));$('fp-total').textContent=photos.length;
 const years=[...new Set(photos.map(p=>p.date?.slice(0,4)).filter(Boolean))].sort().reverse();years.forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;$('fp-year').append(o);});
 let list=photos,shown=0,index=0;const box=$('fp-lightbox');
 function open(i){index=i;const p=list[i];$('fp-large').src=base+p.image;$('fp-large').alt=p.album+' · '+(p.date||'日期待确认');$('fp-caption').textContent=p.album+' · '+(p.date||'日期待确认')+' · '+(p.place?(p.city+' / '+p.place+' · 画面识别待核对'):'具体地点待确认');$('fp-position').textContent=(i+1)+' / '+list.length;if(!box.open)box.showModal();}
 function more(){const chunk=list.slice(shown,shown+32);chunk.forEach((p,offset)=>{const i=shown+offset,button=document.createElement('button'),img=document.createElement('img'),caption=document.createElement('span');button.className='fp-card';button.setAttribute('aria-label','查看 '+p.album+' '+(p.date||'日期待确认')+' 照片');img.src=base+p.image;img.alt=p.album+'照片';img.loading='lazy';img.decoding='async';img.width=p.width;img.height=p.height;caption.textContent=(p.date||'日期待确认')+(p.place?' · '+p.place:'');button.append(img,caption);button.addEventListener('click',()=>open(i));$('fp-grid').append(button);});shown+=chunk.length;$('fp-more').hidden=shown>=list.length;$('fp-state').textContent='共 '+list.length+' 张 · 已展示 '+shown+' 张'+(list.length===0?' · 此城市尚无已定位照片':'');}
 $('fp-more').onclick=more;$('fp-year').onchange=()=>{list=photos.filter(p=>(!$('fp-year').value||p.date?.startsWith($('fp-year').value))&&(!$('fp-city').value||($('fp-city').value==='unknown'?!p.city:p.city===$('fp-city').value)));shown=0;$('fp-grid').replaceChildren();more();};
 state.openPhoto=id=>{const i=photos.findIndex(p=>p.id===id);if(i<0)return;$('fp-year').value='';$('fp-city').value='';$('fp-year').onchange();open(i);};
 $('fp-city').onchange=()=>{$('fp-year').onchange();};$('fp-close').onclick=()=>box.close();$('fp-prev').onclick=()=>open((index-1+list.length)%list.length);$('fp-next').onclick=()=>open((index+1)%list.length);box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('fp-prev').click();if(e.key==='ArrowRight')$('fp-next').click();});box.addEventListener('click',e=>{if(e.target===box)box.close();});more();
 }catch(e){if(active===state&&e.name!=='AbortError')$('fp-state').textContent='相册加载失败，请刷新页面重试。';}
}
document.addEventListener('site:page',init);init();
})();
