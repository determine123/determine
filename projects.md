---
layout: personal
title: 项目
permalink: /projects/
body_class: section-surface
---
<main class="section-page section-page-wide">
<header class="section-hero"><p class="section-kicker">PROJECTS / BUILD LOG</p><h1>项目</h1><p class="section-summary">把模型、系统和真实使用场景连接起来。这里区分已运行的产品、持续实验的工程项目，以及基于上游开源代码完成的改造。</p><div class="section-meta"><a href="#featured">精选项目 →</a><a href="#community">应用与社区 →</a><a href="#catalog">公开仓库 →</a></div></header>

<section class="section-block" id="featured"><div class="section-heading"><h2>Selected Projects</h2><span>Agent · AI Infrastructure · Workflow</span></div><div class="project-ledger">
<article class="project-entry"><span class="project-index">01 / AGENT</span><div><h3><a href="https://github.com/determine123/react-agent">多工具 ReAct Agent ↗</a></h3><p>将工具调用、文档检索、双层记忆与 LangGraph 工作流接入可运行的 Agent，提供 FastAPI 服务、Gradio 界面和 Docker 部署。</p><small>Python · LangGraph · ChromaDB · FastAPI</small></div><strong>ACTIVE</strong></article>
<article class="project-entry"><span class="project-index">02 / AI INFRA</span><div><h3><a href="https://github.com/determine123/flagos-s2-track1">DeepSeek-V3 Decode GEMM 优化 ↗</a></h3><p>团队项目，围绕 tiny-M GEMM 开展 Triton 算子优化、跨后端适配、正确性验证与实验归档。性能数字保留测试条件与来源。</p><small>PyTorch · Triton · Benchmark</small></div><strong>EXPERIMENT</strong></article>
<article class="project-entry"><span class="project-index">03 / WORKFLOW</span><div><h3><a href="https://github.com/determine123/rd-efficiency-daily-assistant">研发效能日报助手 ↗</a></h3><p>从 Git 提交与 RSS 新闻生成结构化日报，将进展绑定到 commit、新闻绑定到来源，并提供质量校验与失败回退。</p><small>Python · FastAPI · LangGraph</small></div><strong>ACTIVE</strong></article>
<article class="project-entry"><span class="project-index">04 / RESEARCH</span><div><h3><a href="https://github.com/determine123/AI-Infra-study">具身智能与 AI Infra 学习记录 ↗</a></h3><p>持续整理强化学习、仿真评估、推理优化与安全约束；公开代码和实验结果按可复现程度逐步收录。</p><small>Research Notes · Reproduction · Evaluation</small></div><strong>ONGOING</strong></article>
</div></section>

<section class="section-block" id="community"><div class="section-heading"><h2>Products &amp; Community</h2><span>可安装应用与浏览器扩展</span></div><div class="project-ledger">
<article class="project-entry"><span class="project-index">05 / APP</span><div><h3><a href="https://github.com/determine123/hupiao-treehole-app">沪漂树洞 · 原生匿名社区 ↗</a></h3><p>React Native 客户端与 Python 后端，支持匿名讨论、举报屏蔽、内容审核和内测反馈。Android 已提供内测版本。</p><small><a href="https://github.com/determine123/hupiao-treehole-app/releases">Android Releases</a> · TypeScript · FastAPI · PostgreSQL</small></div><strong>BETA</strong></article>
<article class="project-entry"><span class="project-index">06 / EXTENSION</span><div><h3><a href="https://github.com/determine123/SJTU_SignIn_Monitor">SJTU Canvas 签到提醒 ↗</a></h3><p>多课程签到状态识别、课前提醒与桌面通知。由使用者点击启用，不自动提交签到，也不绕过登录。</p><small><a href="https://github.com/IcekyPrime/SJTU_SignIn_Monitor">Original project</a> · Manifest V3 · Python</small></div><strong>PUBLIC</strong></article>
<article class="project-entry"><span class="project-index">07 / EXTENSION</span><div><h3><a href="https://github.com/determine123/jAutoVenue">SJTU 体育场馆助手 ↗</a></h3><p>保存场馆偏好、定位场次、标记空位并提醒页面变化；预约与付款仍由使用者在官网确认。</p><small><a href="https://github.com/ifarewell/jAutoVenue">Original project</a> · Manifest V3</small></div><strong>PUBLIC</strong></article>
<article class="project-entry"><span class="project-index">08 / COMMUNITY</span><div><h3><a href="https://github.com/determine123/SAI-Community">SAI 社区网站部署改进 ↗</a></h3><p>修正文档路径、完善搜索配置，并补充依赖清单与本地运行说明；社区内容和框架来自上游项目。</p><small><a href="https://github.com/SJTU-SAI-GeekCenter/SAI-Community">Upstream</a> · MkDocs · Python</small></div><strong>UPSTREAM</strong></article>
</div></section>

<section class="section-block" id="catalog"><div class="section-heading"><h2>GitHub Repositories</h2><span>公开仓库目录</span></div><p class="section-note">目录包含独立仓库与 Fork。是否完成开发、上游来源和个人贡献范围，以各仓库 README、提交与 Pull Request 为准。</p>{% include github-projects.html %}</section>
</main>
