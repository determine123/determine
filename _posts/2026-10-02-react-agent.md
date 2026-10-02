---
layout: post
title: "ReAct Agent：项目结构与阅读入口"
subtitle: "工具调用、检索与记忆如何组成一个可运行的服务"
date: 2026-10-02 10:00:00 +0800
author: determine
tags: [Agent, 工程实践]
---

我的 [ReAct Agent 项目](https://github.com/determine123/react-agent) 将工具调用、文档检索与会话记忆接入 LangGraph 工作流，提供 FastAPI 服务、Gradio 界面和 Docker 部署。

阅读时可以沿着三个问题展开：请求如何进入工作流，工具与检索结果如何返回，以及会话状态如何保存。具体接口、启动方式和评估入口以仓库 README 为准。

这篇文章作为项目阅读入口，后续记录实际实验和设计取舍。
