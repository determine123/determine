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
