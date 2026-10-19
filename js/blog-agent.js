(()=>{
  const configNode=document.getElementById('blog-agent-config');
  const launcher=document.getElementById('blog-agent-open');
  const dialog=document.getElementById('blog-agent-dialog');
  const query=document.getElementById('blog-agent-query');
  const form=document.getElementById('blog-agent-form');
  const messages=document.getElementById('blog-agent-messages');
  const suggestions=document.getElementById('blog-agent-suggestions');
  const status=document.getElementById('blog-agent-status');
  const privacy=document.getElementById('blog-agent-privacy');
  if(!configNode||!launcher||!dialog||!query||!form||!messages||!suggestions)return;

  let config={};
  try{config=JSON.parse(configNode.textContent||'{}')}catch{}
  const title=document.getElementById('blog-agent-title');
  const overline=document.querySelector('.agent-overline');
  const intro=document.getElementById('blog-agent-intro');
  if(title&&config.title)title.textContent=config.title;
  if(overline&&config.name)overline.textContent=`${config.owner||'DETERMINE'} · ${config.name}`;
  if(intro&&config.description)intro.textContent=config.description;
  if(config.endpoint){
    if(status)status.textContent=`${config.model||'AI'} · 在线对话`;
    if(privacy)privacy.textContent=`在线模式 · 问题会发送至智谱 AI（${config.model||'GLM Flash'}）处理；请勿输入隐私信息`;
  }
  const index=[...document.querySelectorAll('#search-index a')];
  const byPath=fragment=>index.find(link=>new URL(link.href).pathname.includes(fragment));
  const destinations={
    projects:byPath('/projects/'),learning:byPath('/learning/'),about:byPath('/about/'),
    timeline:byPath('/timeline/'),footprints:byPath('/footprints/'),archive:byPath('/archive/'),
    318:byPath('/sichuan-tibet-318/'),hainan:byPath('/hainan-island/'),xian:byPath('/chengdu-xian/'),
    undergraduate:byPath('/undergraduate/'),graduate:byPath('/graduate/')
  };
  const curated=[
    {match:/川藏|318|拉萨|骑行西藏/,text:'这段旅程可以从成都出发，沿着川藏线一路读到拉萨。',links:['318','footprints']},
    {match:/海南|环岛|日月湾|文昌/,text:'环海南岛的记录从出发、器材小事故到沿海骑行展开。',links:['hainan','footprints']},
    {match:/西安|华山|秦岭|汉中|广元/,text:'成都到西安的骑行与华山夜爬记录都收在城市足迹里。',links:['xian','footprints']},
    {match:/旅行|城市|足迹|地图|去过|旅程/,text:'可以先看城市足迹总览，再沿不同旅程继续探索。',links:['footprints','318','hainan','xian']},
    {match:/学习|论文|阅读|面试|课程|知识/,text:'学习模块整理了 AI、Agent 与工程实践相关的阅读和笔记。',links:['learning','archive']},
    {match:/项目|agent|大模型|人工智能|ai\s*infra|基础设施|机器人|具身|代码|github/i,text:'可以从项目目录进入 Agent、AI Infra 和机器人方向的实践记录。',links:['projects','archive']},
    {match:/关于|介绍|背景|学校|交大|sjtu|cdut|经历|你是谁|determine/i,text:'determine 是上海交通大学硕士在读、成都理工大学本科，持续关注 LLM Agent、AI Infra 与具身智能。',links:['about','undergraduate','graduate','projects']}
  ];
  const stopWords=new Set(['帮我','看看','介绍','一下','哪些','这个','怎么','如何','记录','最近','我的','博客','可以','想要','一下子','以及','关于','从哪','有没有','吗','呢','什么','我想','推荐']);

  function makeAnchor(link,label){
    const anchor=document.createElement('a');anchor.className='agent-link';anchor.href=link.href;
    anchor.append(document.createTextNode(label||link.textContent.trim()));return anchor;
  }
  function addMessage(text,role='bot',links=[]){
    const article=document.createElement('article');article.className='agent-message '+(role==='user'?'agent-message-user':'agent-message-bot');
    if(role==='bot'){const mark=document.createElement('span');mark.className='agent-message-mark';mark.setAttribute('aria-hidden','true');mark.textContent='✦';article.append(mark)}
    const copy=document.createElement('p');copy.textContent=text;article.append(copy);
    if(links.length){const list=document.createElement('div');list.className='agent-links';for(const item of links){const link=item.link||item;if(link?.href)list.append(makeAnchor(link,item.label))}article.append(list)}
    messages.append(article);messages.scrollTop=messages.scrollHeight;return article;
  }
  function selectedRoutes(keys){return keys.map(key=>destinations[key]).filter(Boolean).map(link=>({link,label:link.textContent.trim()}))}
  function scoreMatches(term){
    const words=term.toLocaleLowerCase().match(/[a-z0-9+#.-]{2,}|[\u3400-\u9fff]{2,}/g)||[];
    const useful=words.filter(word=>!stopWords.has(word));
    return index.map(link=>{
      const text=(link.textContent+' '+(link.dataset.tags||'')).toLocaleLowerCase();
      const score=useful.reduce((total,word)=>total+(text.includes(word)?(text.startsWith(word)?3:1):0),0);
      return {link,score};
    }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(item=>({link:item.link,label:item.link.textContent.trim()}));
  }
  function respond(text){
    const match=curated.find(item=>item.match.test(text));
    if(match)return {text:match.text,links:selectedRoutes(match.links)};
    const results=scoreMatches(text);
    if(results.length)return {text:'我从博客公开索引里找到这些相关入口，可以点开继续看：',links:results};
    return {text:'这条博客目前没有足够的公开资料让我可靠回答。我可以带你浏览项目、学习记录、个人介绍，或城市足迹；你也可以用右下角搜索框找文章。',links:selectedRoutes(['projects','learning','about','footprints','archive'])};
  }
  async function askModel(text,history){
    const context=scoreMatches(text).slice(0,8).map(({link})=>({title:link.textContent.trim(),url:link.href}));
    const response=await fetch(config.endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:text,context,history}),signal:AbortSignal.timeout(30_000),credentials:'omit',referrerPolicy:'no-referrer'});
    let data;
    try{data=await response.json()}catch{throw new Error('模型服务返回了无法读取的响应。')}
    if(!response.ok)throw new Error(data.error||'模型服务暂时不可用。');
    if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('模型没有返回有效回答。');
    return {text:data.answer.trim(),links:context.map(item=>({href:item.url,label:item.title}))};
  }
  function open(){if(!dialog.open)dialog.showModal();query.focus()}
  launcher.addEventListener('click',open);
  document.getElementById('blog-agent-inline')?.addEventListener('click',open);
  document.getElementById('blog-agent-close')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>launcher.focus());
  for(const prompt of (Array.isArray(config.suggestions)?config.suggestions:[]).slice(0,5)){
    const button=document.createElement('button');button.type='button';button.className='agent-suggestion';button.textContent=prompt;
    button.addEventListener('click',()=>{query.value=prompt;form.requestSubmit()});suggestions.append(button);
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();const text=query.value.trim();if(!text)return;
    const history=[...messages.querySelectorAll('.agent-message')].map(item=>({role:item.classList.contains('agent-message-user')?'user':'assistant',content:item.querySelector('p')?.textContent||''})).filter(item=>item.content.trim()).slice(-8);
    addMessage(text,'user');query.value='';
    const submit=form.querySelector('button[type="submit"]');submit.disabled=true;
    if(config.endpoint){
      status.textContent='正在连接模型…';
      try{const response=await askModel(text,history);addMessage(response.text,'bot',response.links);status.textContent=`${config.model||'AI'} · 已回复`}
      catch(error){addMessage(`${error.message} 我先用博客本地索引帮你找相关页面。`,'bot');const fallback=respond(text);addMessage(fallback.text,'bot',fallback.links);status.textContent='模型暂不可用 · 已切换本地导航'}
      finally{submit.disabled=false;query.focus()}
      return;
    }
    const response=respond(text);addMessage(response.text,'bot',response.links);
    status.textContent='本地检索完成 · 输入不会发送到服务器';submit.disabled=false;
  });
})();
