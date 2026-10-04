# determine 技术博客

基于 [Huxpro / Hux Blog](https://github.com/Huxpro/huxpro.github.io)（Apache-2.0）改造。保留上游许可证，修改导航、个人资料与站点配置；不包含上游作者的文章、分析账号或广告配置。

部署于 https://determine123.github.io/determine/ 。参考 [BY 搭建教程](https://github.com/qiubaiying/qiubaiying.github.io/wiki/博客搭建详细教程)。

文章放入 `_posts`；域名确定并完成购买后，再配置 GitHub Pages 自定义域名、DNS 与 HTTPS。

## 更新 GitHub 项目目录

运行 `python scripts/sync_projects.py`，从公开 GitHub API 分页收集本人公开仓库，保留真实 Fork 与归档标识，并更新 `_data/github_projects.json`。全部请求成功后才替换文件；空结果和网络失败不会清空原目录。人工维护的 `projects.md` 项目说明仍需按实际交付更新。

未认证的 API 有访问额度限制。需要时可通过临时环境变量 `GITHUB_TOKEN` 提供自己的凭据，工具不会写入或打印凭据。不要把令牌放进脚本或提交到仓库。

验证：`python -m unittest discover -s tests -p "test_sync_projects.py" -v`。GitHub Pages 发布前也会运行这些测试。
