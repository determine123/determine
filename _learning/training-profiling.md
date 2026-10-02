---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "训练性能分析：从指标到瓶颈"
kind: "学习笔记"
source_date: "2022-08-31"
source_url: "https://gaocegege.com/Blog/kubernetes/metrics-survey"
order: 7
tags: ["AI Infra", "研究方法"]
focus: "工程基础"
description: "结合你的 Triton 实验记录，把吞吐变化与执行轨迹、数据搬运和实验条件联系起来。"
---

## 阅读摘要

原文说明训练负载可能受计算、数据或内存限制，并介绍 TensorBoard、nvidia-smi、Nsight Systems 等可观测性工具。它是一篇历史入门文章，工具版本和维护状态需另查当前官方文档。 [原文](https://gaocegege.com/Blog/kubernetes/metrics-survey)

## 与当前项目的联系

结合你的 Triton 实验记录，把吞吐变化与执行轨迹、数据搬运和实验条件联系起来。

## 面试讨论

GPU 利用率能否直接说明瓶颈？端到端性能和单算子性能有什么区别？如何保证比较公平？

## 建议实验

选一个可复现负载，保存基线、预热设置、输入形状、设备和软件版本；一次只改一个因素，报告多次结果。

## 研究延伸

给出明确瓶颈假设和验证方法，将局部收益与整体收益分开报告。
