---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "Agent 沙箱：隔离、启动与兼容性"
kind: "学习笔记"
source_date: "2026-02-17"
source_url: "https://gaocegege.com/Blog/genai/unikernel-agent"
order: 3
tags: ["Agent", "AI Infra"]
focus: "工程基础"
description: "为 Agent 执行代码的场景明确边界：文件、网络、CPU、内存、时长，以及需要兼容的库。"
---

## 阅读摘要

原文从冷启动、安全隔离、Python 生态兼容和镜像构建需求出发，讨论容器、轻量虚拟机及 unikernel 的选择。它把 unikernel 作为探索方向，而不是已经验证的通用最优方案。 [原文](https://gaocegege.com/Blog/genai/unikernel-agent)

## 与当前项目的联系

为 Agent 执行代码的场景明确边界：文件、网络、CPU、内存、时长，以及需要兼容的库。

## 面试讨论

进程隔离和虚拟机隔离有什么不同？冷启动测量是否包含镜像拉取？兼容性不足会怎样影响工具使用？

## 建议实验

先在你可控的环境里测容器启动，分别记录镜像未缓存与已缓存情况；再检查超时和资源限制是否生效。

## 研究延伸

设计统一任务与相同安全假设，比较启动延迟、资源占用和库兼容性，保留未验证项。
