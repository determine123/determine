// Read the public whole-site comment count without fetching visitor/comment details.
(()=>{
  let cached=null,pending=null;
  async function count(server){
    if(cached?.server===server&&Date.now()-cached.at<60000)return cached.value;
    if(pending?.server===server)return pending.task;
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
    const task=(async()=>{
      try{
        const response=await fetch(server.replace(/\/$/,'')+'/api/comment?type=count',{credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
        if(!response.ok)throw Error('Comment service unavailable');
        const result=await response.json();
        if(result.errno!==0||!Number.isSafeInteger(result.data)||result.data<0)throw Error('Invalid comment count');
        cached={server,value:result.data,at:Date.now()};return result.data;
      }finally{clearTimeout(timer);if(pending?.task===task)pending=null;}
    })();
    pending={server,task};return task;
  }
  function init(){
    const card=document.querySelector('.site-statistics'),target=card?.querySelector('[data-stat-comments]'),status=card?.querySelector('[data-stat-comment-status]');
    if(!target||!status)return;
    const server=card.dataset.statCommentServer;
    if(!server){status.textContent='评论统计未配置';return;}
    count(server).then(value=>{
      if(!target.isConnected)return;
      target.textContent=value.toLocaleString('zh-CN');target.title='Waline 全站评论总数（本次查询）：'+value+' 条';
      status.textContent='评论计数已获取';
    }).catch(()=>{
      if(!target.isConnected)return;
      target.textContent='—';status.textContent='评论统计暂不可用，点击重试';
      const retry=document.createElement('button');retry.type='button';retry.textContent='重试评论统计';
      retry.addEventListener('click',()=>{retry.remove();status.textContent='评论统计正在加载…';init();},{once:true});status.append(' ',retry);
    });
  }
  init();document.addEventListener('site:page',init);
})();
