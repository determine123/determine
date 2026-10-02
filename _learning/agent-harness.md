---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "Agent Harness：状态、执行与多租户"
kind: "学习笔记"
source_date: "2026-09-05"
source_url: "https://gaocegege.com/Blog/genai/server-side-agent"
order: 2
tags: ["Agent", "AI Infra"]
focus: "就业优先"
description: "用你已有的 ReAct Agent 画出请求、会话状态、工具执行和结果存储的流向，说明进程重启后哪些信息可以恢复。"
---

## 阅读摘要

原文讨论 Agent 与执行沙箱绑定带来的故障恢复困难，比较服务端 Agent 与独占环境，并关注会话、工具、沙箱、编排之间的边界，以及上下文策略与离线评估的一致性。 [原文](https://gaocegege.com/Blog/genai/server-side-agent)

## 与当前项目的联系

用你已有的 ReAct Agent 画出请求、会话状态、工具执行和结果存储的流向，说明进程重启后哪些信息可以恢复。

## 面试讨论

会话状态放在哪里？工具执行失败和会话丢失如何区分？如何让离线评测覆盖线上同一条执行路径？

## 建议实验

给一条工具调用增加执行 ID、超时和结果记录，注入执行进程故障，检查恢复后的重复执行与结果一致性。

## 研究延伸

比较耦合与分离设计在故障恢复时间、状态一致性和维护复杂度上的差异。
