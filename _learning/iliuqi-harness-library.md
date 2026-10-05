---
layout: learning
title: "DeepSeek Harness：源码阅读路线与章节导航"
date: "2026-10-05T00:00:00+08:00"
added: "2026-10-05"
source_author: "云栖梦泽 · MiniDocs（汇集库见具体原作者）"
source_date: "2026-09-04"
source_url: "https://www.iliuqi.com/docs/view/deepseek-harness"
kind: "知识库导读"
order: 41
tags: ["Agent", "AI Infra"]
focus: "Agent 源码导读"
description: "建议先读总体架构、框架基础与核心循环，然后查看持久化和安全隔离。把教程中的文件路径映射到目标源码提交，记录章节与代码是否一致；出现差异时不要把示…"
---

## 库内容概览

该教程从运行环境和 Cordis 插件框架进入 Agent 循环，再讨论模型、工具、持久化、隔离和外部接口。章节适合作为读源码的路线；实现细节仍需与对应代码版本对照。 [原知识库](https://www.iliuqi.com/docs/view/deepseek-harness)。

## 本站建议阅读路线

建议先读总体架构、框架基础与核心循环，然后查看持久化和安全隔离。把教程中的文件路径映射到目标源码提交，记录章节与代码是否一致；出现差异时不要把示意代码当成当前接口。

## 章节入口

- [README](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853eb7683)
- [01-总体架构](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC2026090411253369b9a9)
- [02-环境与运行](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904120817cb744c)
- [03-Cordis 框架基础](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904120817ca8a76)
- [04-核心与 Agent 循环](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC2026090415485386118f)
- [05-LLM 能力](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC2026090415485385fc04)
- [06-工具与数据类能力](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853c0d1f6)
- [07-Agent 编排](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853d218ef)
- [08-上下文与人类协作](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853b93bd6)
- [09-持久化与数据平面](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853cf46d1)
- [10-安全沙箱与隔离](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853b9afa9)
- [11-Session 日志深度](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC2026090415485397111c)
- [12-Typert 类型图系统](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC2026090415485397c765)
- [13-Web Client 架构](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC202609041548535105ed)
- [14-API Gateway 与 SDK](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853f8e739)
- [15-凭证与授权](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853845903)
- [16-Webhook 与外部事件](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853d392db)
- [17-Self-Modification 扩展](https://www.iliuqi.com/docs/view/deepseek-harness?docSlug=DOC20260904154853844b71)

此处提供精选目录链接，未镜像全部正文。更多章节请进入原知识库。目录采集于 2026-10-05，已采集链接数量不等于已逐篇阅读数量。

## 建议练习与验收

针对一次工具调用，记录输入、模型请求、工具结果、取消与会话日志的关系。以模拟工具注入超时，检查状态与日志；保存提交号和测试结果，不运行不熟悉的 Shell 示例。

以上路线与练习为本站建议，尚未执行。AI 汇集文章不自动归为博主原创，授权和出处以具体原文为准。
