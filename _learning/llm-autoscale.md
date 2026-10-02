---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "LLM 服务部署：冷启动与扩缩容"
kind: "学习笔记"
source_date: "2024-12-31"
source_url: "https://gaocegege.com/Blog/genai/openmodelz-journey-cn"
order: 5
tags: ["AI Infra"]
focus: "就业优先"
description: "把 API 层、推理实例与扩缩容控制分开理解，将服务指标和用户等待时间联系起来。"
---

## 阅读摘要

原文分享 ModelZ 的 Kubernetes 推理服务实践，介绍 Gateway、Controller、Autoscaler，并拆分镜像与模型加载的冷启动开销。系统设计同时涉及调度、负载和自动扩缩容策略。 [原文](https://gaocegege.com/Blog/genai/openmodelz-journey-cn)

## 与当前项目的联系

把 API 层、推理实例与扩缩容控制分开理解，将服务指标和用户等待时间联系起来。

## 面试讨论

扩容为什么不能立即降低等待时间？缩到零有什么代价？如何区分模型下载、加载与排队的耗时？

## 建议实验

从一个本地推理服务开始记录启动阶段和请求时间；用固定请求集比较冷启动与热启动，注明模型、设备和并发。

## 研究延伸

在相同负载下比较不同预热策略，用首请求延迟、尾延迟和资源占用评价取舍。
