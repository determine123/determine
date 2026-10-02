---
layout: "learning"
source_author: "高策"
added: "2026-10-02"
title: "RAG 检索：HNSW、IVF 与成本约束"
kind: "学习笔记"
source_date: "2024-12-25"
source_url: "https://gaocegege.com/Blog/genai/hnsw"
order: 6
tags: ["Agent", "AI Infra"]
focus: "项目深化"
description: "为你的 RAG 模块建立可对照的检索集，说明为什么选某种索引，而不是只列数据库名称。"
---

## 阅读摘要

原文讨论 HNSW 在大规模向量检索中的内存与访问开销，关注 IVF、量化和重排作为替代思路。文章带有作者的选型观点，应在自己的数据规模与召回目标下验证。 [原文](https://gaocegege.com/Blog/genai/hnsw)

## 与当前项目的联系

为你的 RAG 模块建立可对照的检索集，说明为什么选某种索引，而不是只列数据库名称。

## 面试讨论

近似检索为什么会漏召回？索引参数如何影响召回与延迟？压缩表示后为什么还需要重排？

## 建议实验

固定嵌入模型、语料和查询，建立精确搜索基线，再记录候选索引的 recall@k、延迟、内存和构建时间。

## 研究延伸

在相同召回目标下比较成本；分别测试数据规模与更新频率，避免单次结果推广到所有场景。
