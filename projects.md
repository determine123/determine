---
layout: page
title: 项目
permalink: /projects/
---

### 多工具 ReAct Agent

将工具调用、文档检索、双层记忆与 LangGraph 工作流接入一个可运行的 Agent，提供 FastAPI 服务、Gradio 界面和 Docker 部署。

**关注点：**工具注册与调度、检索来源返回、会话记忆，以及基础评估与 RAGAS 评估入口。

[源码与运行说明](https://github.com/determine123/react-agent) · Python / LangGraph / ChromaDB / FastAPI

### DeepSeek-V3 Decode GEMM 优化

团队项目，围绕 tiny-M GEMM 开展 Triton 算子优化、跨后端适配、正确性验证与实验归档。

2026-09-15 团队转录的平台快照：8/8 后端通过，平均加速比 2.50×。这不是本地重测或端到端推理收益；个人贡献见 PR 与实验记录。

[源码与实验](https://github.com/determine123/flagos-s2-track1) · PyTorch / Triton / Benchmark

### 研发效能日报助手

从 Git 提交与 RSS 新闻生成结构化日报，将工程进展绑定到 commit，将新闻绑定到来源。提供确定性规则生成、质量校验、可选 LLM 摘要与失败回退，以及 API 和 LangGraph 工作流。

[源码与示例](https://github.com/determine123/rd-efficiency-daily-assistant) · Python / FastAPI / LangGraph

### 具身智能与机器人控制

持续探索强化学习、仿真评估与安全约束。相关复现材料整理中，公开代码和结果完善后收录。

[AI Infra 学习记录](https://github.com/determine123/AI-Infra-study)

### 沪漂树洞 · 原生匿名社区

Expo / React Native 客户端与 Python FastAPI 后端，支持匿名身份、多版块讨论、共鸣、举报与屏蔽、先审后发，以及私密内测反馈。审核记录将内部备注与给作者的说明分开，避免公开管理员内部信息。

已提供 Android 1.0.2 内测安装包并连接公网 PostgreSQL / Redis 后端。升级沿用原包名和签名，可覆盖安装；iOS 尚未生成 IPA 或上架。旧网页演示与原生版数据库尚未迁移合并。

[下载 Android 内测版](https://github.com/determine123/hupiao-treehole-app/releases/download/v1.0.2-beta.1/hupiao-treehole-1.0.2-beta.1.apk) · [源码与验证记录](https://github.com/determine123/hupiao-treehole-app) · [版本说明](https://github.com/determine123/hupiao-treehole-app/releases/tag/v1.0.2-beta.1) · [原网页演示](https://hupiao-treehole.litianming99999.chatgpt.site/) · TypeScript / React Native / Python / PostgreSQL

### SJTU Canvas 签到提醒

基于现有 Python 监控脚本完善，并封装为 Edge 扩展。支持多课程签到状态识别、点击启用、课前 30 分钟提醒、桌面通知、声音及可选手机推送。公开版由使用者填写课程与课表。

提醒需要浏览器运行、电脑不休眠；手机服务不保证最终送达。不自动提交签到，不绕过登录。

[源码与安装说明](https://github.com/determine123/SJTU_SignIn_Monitor) · [原项目](https://github.com/IcekyPrime/SJTU_SignIn_Monitor) · JavaScript / Manifest V3 / Python

### SJTU 体育场馆助手

基于 jAutoVenue 项目新增 Edge 扩展，保存场馆偏好、定位场次、标记可用空位并提醒页面变化。预约和付款由使用者在官网手动完成；旧 Python 脚本保留作历史参考。

[源码与安装说明](https://github.com/determine123/jAutoVenue) · [原项目](https://github.com/ifarewell/jAutoVenue) · JavaScript / Manifest V3

### SAI 社区网站部署改进

部署上海交通大学 SAI 社区 MkDocs 网站，修正文档路径、完善搜索插件配置，并提供依赖清单与本地运行说明。社区内容和原站框架来自上游项目。

[源码与部署说明](https://github.com/determine123/SAI-Community) · [原项目](https://github.com/SJTU-SAI-GeekCenter/SAI-Community) · MkDocs / Python

## GitHub 公开仓库目录

同步于 2026-10-04。下列目录包含公开独立仓库与 Fork；独立仓库也可能基于上游代码改造，具体来源和个人贡献以仓库说明为准。Fork 的收录不表示已经完成开发或贡献。

{% include github-projects.html %}
