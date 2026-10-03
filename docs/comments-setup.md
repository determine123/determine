# 评论后台接入

博客已接入 Waline，覆盖文章、学习笔记和个人随笔。后台未配置时显示“评论暂未开放”，不采集用户输入。

1. 按 https://waline.js.org/en/guide/get-started/ 部署 Waline 到 Vercel，连接免费 Neon PostgreSQL 并执行官方初始化 SQL。
2. 站主先注册后台管理员，然后再开放评论。Waline 的第一个注册账号为管理员，切勿先公布尚未初始化的后台地址。
3. 配置后台邮件发送服务，验证邮箱注册、验证邮件和回复通知；邮件密码仅放后台环境变量，勿提交进仓库。
4. 按官方 OAuth 文档配置 GitHub 登录，并验证首次登录、退出及账号关联。OAuth Secret 仅放后台，不放网页配置。
5. 后台设置允许的博客域名（GitHub Pages 和 Cloudflare），开启评论审核和反垃圾配置。
6. 将公开后台 HTTPS 地址填入 `_config.yml` 的 `comments.server_url`，不带末尾斜线，重新发布。
7. 使用 GitHub 和邮箱各发布一条测试评论，测试跨文章隔离、跨域地址一致、回复邮件以及后台审核/删除。

客户端按页面路径绑定评论，因此两个博客域名共享同一文章评论。切换页面时重建评论组件，不重建音乐播放器。

管理入口为后台地址 `/ui`。Cloudflare 当前为手动上传，GitHub 发布后还须同步静态发布包。

参考：https://waline.js.org/en/guide/features/notification.html
