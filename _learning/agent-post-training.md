---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "Agent 后训练：从失败轨迹到可复现实验"
kind: "学习笔记"
source_date: "2026-02-16"
source_url: "https://gaocegege.com/Blog/genai/jiucai-rl"
order: 4
tags: ["Agent", "研究方法"]
focus: "研究拓展"
description: "将你的 ReAct Agent 失败案例按工具选择、参数、推理和上下文丢失分类，先建立固定评测集。"
---

## 阅读摘要

原文以工具使用 Agent 的调试与后训练实验展开，涉及请求轨迹记录、SFT、RL、训练资源和奖励分布。作者也指出数据质量与测试规模带来的不确定性；文中效果数字属于其特定实验。 [原文](https://gaocegege.com/Blog/genai/jiucai-rl)

## 与当前项目的联系

将你的 ReAct Agent 失败案例按工具选择、参数、推理和上下文丢失分类，先建立固定评测集。

## 面试讨论

为什么先评测再训练？如何隔离训练集与测试集？工具使用提升是否可能伴随其他能力下降？

## 建议实验

建立一组有明确验收结果的工具任务，保存输入输出、调用参数、错误和耗时；先比较提示修改前后的完成率。

## 研究延伸

明确一个失败假设，设置对照、重复次数与误差分析；有数据和算力后，再考虑 SFT 或 RL。
