---
layout: about-profile
title: 关于 determine
description: Agent 开发、AI Infra 与智能系统的项目和学习记录。
permalink: /about/
---

<section class="about-introduction" aria-labelledby="profile-name">
<div class="about-biography">
<div class="about-kicker">ABOUT / 关于我</div>
<h1 id="profile-name">determine</h1>
<div class="about-role">Agent 开发 · AI Infra · 智能系统</div>
<nav class="about-links" aria-label="个人链接"><a href="mailto:determine@sjtu.edu.cn">Email</a><a href="https://github.com/determine123">GitHub</a><a href="{{ '/projects/' | relative_url }}">Projects</a><a href="{{ '/archive/' | relative_url }}">Writing</a></nav>
<p>你好，我是 <strong>determine</strong>，上海交通大学机械硕士在读，成都理工大学人工智能本科。主攻 <strong>Agent 开发</strong>，关注 AI Infra、具身智能和机器人控制。</p>
<p>我希望把模型能力落实为可以运行、评估和维护的系统。在这里记录工具调用、工作流、算子优化与工程实践，也保留学习过程和生活的片段。</p>
<p class="about-availability">正在寻找 Agent 开发、AI Infra 相关实习机会，欢迎交流。</p>
</div>
<figure class="about-portrait">
{% assign profile_avatar = site.static_files | where: 'path', '/img/avatar.png' | first %}
<img src="{% if profile_avatar %}{{ '/img/avatar.png' | relative_url }}{% else %}https://github.com/determine123.png?size=360{% endif %}" alt="determine 的 GitHub 头像" width="216" height="216" decoding="async">
<figcaption>Shanghai, China<br><a href="mailto:determine@sjtu.edu.cn">determine@sjtu.edu.cn</a></figcaption>
</figure>
</section>
<nav class="about-sections" aria-label="关于页目录"><a href="#interests">关注方向</a><a href="#selected-projects">精选项目</a><a href="#education">教育背景</a><a href="#contributions">开源贡献</a></nav>

<section class="about-section" id="interests"><h2>Interests <span>关注方向</span></h2>
<dl class="about-interest-grid"><div><dt>Agent Engineering</dt><dd>工具调用、RAG、记忆与工作流编排，以及可追踪的评估过程。</dd></div><div><dt>AI Infrastructure</dt><dd>推理效率、Triton 算子、跨后端实验与可复现的性能记录。</dd></div><div><dt>Embodied Intelligence</dt><dd>强化学习、仿真，以及智能系统的决策与控制。</dd></div></dl></section>

<section class="about-section" id="selected-projects"><h2>Selected Projects <span>精选项目</span></h2>
<article class="about-project"><div class="about-project-mark"><b>01</b>AGENT</div><div><h3><a href="https://github.com/determine123/react-agent">多工具 ReAct Agent</a></h3><p class="about-meta">Python · LangGraph · FastAPI · Gradio · Docker</p><p>围绕工具调用、RAG、记忆和 LangGraph 工作流构建 Agent，探索从模型交互到服务部署的工程过程。</p><div class="about-project-links"><a href="https://github.com/determine123/react-agent">Code ↗</a></div></div></article>
<article class="about-project"><div class="about-project-mark"><b>02</b>AI INFRA</div><div><h3><a href="https://github.com/determine123/flagos-s2-track1">DeepSeek-V3 Decode GEMM</a></h3><p class="about-meta">团队项目 · Triton · 跨后端性能实验</p><p>参与 Triton 算子优化与跨后端实验。团队成果与个人贡献分别通过实验记录和 PR 查看，关注测量条件与复现过程。</p><div class="about-project-links"><a href="https://github.com/determine123/flagos-s2-track1">Code ↗</a><a href="https://github.com/determine123/flagos-s2-track1/blob/main/docs/EXPERIMENTS.md">Experiments ↗</a></div></div></article>
<article class="about-project"><div class="about-project-mark"><b>03</b>WORKFLOW</div><div><h3><a href="https://github.com/determine123/rd-efficiency-daily-assistant">研发效能日报助手</a></h3><p class="about-meta">Python · 结构化日报 · 来源追踪</p><p>将提交与新闻来源组织为结构化日报，通过规则校验与可选 LLM 摘要，让生成内容保留可核对的依据。</p><div class="about-project-links"><a href="https://github.com/determine123/rd-efficiency-daily-assistant">Code ↗</a></div></div></article>
<article class="about-project"><div class="about-project-mark"><b>04</b>COMMUNITY</div><div><h3><a href="https://github.com/determine123/hupiao-treehole-app">沪漂树洞</a></h3><p class="about-meta">Android 内测 · Python / FastAPI · Expo</p><p>面向沪漂生活的匿名交流应用，持续完善内容审核、举报和内测反馈。Android APK 与 Python 后端已进入内测；iOS 与商店发布仍在推进。</p><div class="about-project-links"><a href="https://github.com/determine123/hupiao-treehole-app">Code ↗</a><a href="https://github.com/determine123/hupiao-treehole-app/releases">Android Releases ↗</a></div></div></article>
<p><a href="{{ '/projects/' | relative_url }}">查看完整项目目录 →</a></p></section>

<section class="about-section" id="education"><h2>Education <span>教育背景</span></h2><div class="about-education"><div><h3>上海交通大学</h3><p>机械 · 硕士在读</p></div><div><h3>成都理工大学</h3><p>人工智能 · 本科</p></div></div></section>

<section class="about-section" id="contributions"><h2>Open Source <span>开源贡献</span></h2><ul class="about-contributions"><li><a href="https://github.com/caomaolufei/AIInfraGuide/pull/46">AIInfraGuide · PR #46</a><small>贡献详情与讨论</small></li><li><a href="https://github.com/bojieli/ai-infra-book/pull/3">ai-infra-book · PR #3</a><small>贡献详情与讨论</small></li><li><a href="https://github.com/adongwanai/AgentGuide/pull/167">AgentGuide · PR #167</a><small>贡献详情与讨论</small></li></ul></section>

<footer class="about-closing"><p>欢迎就项目、学习或实习机会联系我：<a href="mailto:determine@sjtu.edu.cn">determine@sjtu.edu.cn</a>。</p><p><a href="{{ '/feed.xml' | relative_url }}">订阅 RSS</a> · <a href="{{ '/colophon/' | relative_url }}">关于本站与内容来源</a></p><p class="about-credit">页面排版参考 <a href="https://tairanhe.com/">Tairan He 的个人主页</a>，项目与经历以本站公开资料为依据。</p></footer>
