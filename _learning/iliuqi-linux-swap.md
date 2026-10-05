---
layout: learning
title: "Linux Swap：从页面回收到服务性能观察"
date: "2026-10-05T10:00:00+08:00"
added: "2026-10-05"
source_author: "林渡 · 云栖梦泽"
source_date: "2026-08-28"
source_url: "https://www.iliuqi.com/archives/linux-memory-management-058"
kind: "学习笔记"
order: 32
tags: ["AI Infra", "Linux"]
focus: "服务器内存基础"
description: "区分文件页、匿名页与交换空间，形成解释后端延迟和内存压力的观察清单。"
---

## 阅读摘要

原文以 Linux 5.15 为背景解释交换子系统，区分文件页与匿名页的后备存储，并介绍 Swap Area、Slot、Entry 的关系。它通过页表与交换缓存的关联说明换出后如何定位数据。[阅读原文](https://www.iliuqi.com/archives/linux-memory-management-058)。

## 与当前项目的联系

以下为本站提出的性能观察练习：后端请求变慢时，同时记录工作负载、进程内存与系统内存压力，不直接把延迟归因于数据库或模型。Swap 是主机内存主题，不能用来替代 GPU 显存、KV Cache 或推理吞吐分析。

## 讨论问题

- 虚拟地址空间大小和实际驻留内存为什么不能混用？
- 有交换活动时，怎样判断它是否与请求延迟有关？
- 内核版本、容器限制和宿主机配置会怎样影响观察结果？

## 建议实验与验收

在个人测试虚拟机中，先记录 `uname -r`、`free -h` 与 `vmstat 1` 的输出，再以固定并发运行小型 HTTP 服务。对比空闲与有限负载下的请求延迟、RSS 和交换计数；若没有交换活动，也保留这一结果，不强行制造结论。验收记录包含环境、并发、采样时间与数据，不在生产服务器修改 Swap 或触发 OOM。

此处是阅读路线与实验提案，不代表已经对线上服务做过性能测量。
