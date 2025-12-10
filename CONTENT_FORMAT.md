# AI Blog Post Content Format

이 프로젝트는 `posts/` 디렉토리 내의 **Markdown (.md)** 파일을 사용하여 게시글을 관리합니다.
새로운 글을 작성할 때는 아래 규칙을 반드시 따라야 합니다.

## 1. 파일 생성 규칙 (File Naming)
*   **경로**: `d:/homepage/antiBlog/posts/`
*   **파일명**: 영문 소문자와 하이픈(-)만 사용 (예: `best-dividend-stocks-2025.md`)
*   이 파일명이 게시글의 URL 슬러그가 됩니다. (예: `/article/best-dividend-stocks-2025`)

## 2. 내용 작성 규칙 (Structure)

파일은 크게 **Frontmatter (메타데이터)**와 **Body (본문)** 두 부분으로 나뉩니다.

### Frontmatter (상단 메타데이터)
파일의 맨 처음에 `---`로 감싸서 작성하며, 다음 필드들을 포함해야 합니다.

*   `title`: 글 제목 (String)
*   `date`: 작성일 (YYYY-MM-DD 형식)
*   `category`: 카테고리 (Stocks, Retirement, Banking, Credit Cards 중 택1)
*   `author`: 작성자 이름
*   `excerpt`: 글 목록(카드)에 표시될 짧은 요약문
*   `image`: 대표 이미지 URL (Unsplash 등 사용)
*   `tags`: 태그 목록 (Array of Strings). 예: `["Dividends", "Investing"]`

### Body (본문)
Frontmatter 아래에 **순수 Markdown 문법**을 사용하여 작성합니다.
**주의: HTML 태그(`<p>`, `<h2>` 등)를 직접 사용하지 마세요.**

*   **제목**: `## 소제목` (H2), `### 소소제목` (H3) 사용
*   **강조**: `**굵게**`, `_기울임_`
*   **목록**: `-`, `1.` 사용
*   **인용**: `> 인용문` 사용
*   **링크**: `[텍스트](URL)`

## 3. 예시 (Example)

```markdown
---
title: "7 Best Monthly Dividend Stocks to Buy Right Now"
date: "2025-12-08"
category: "Stocks"
author: "James Royal"
excerpt: "Monthly dividend stocks offer regular income. Here are top picks for steady cash flow."
image: "https://images.unsplash.com/photo-1611974765270-ca125884b9b1?w=800&auto=format&fit=crop"
tags: ["Stocks", "Dividends", "Passive Income"]
---

Monthly dividend stocks are a favorite among income investors. Unlike most companies that pay quarterly, these stocks provide a paycheck 12 times a year.

## Why Choose Monthly Dividends?

The primary benefit is **faster compounding**. If you reinvest your dividends, doing so monthly instead of quarterly can slightly boost your long-term returns. Additionally, for retirees living off dividends, monthly payments align better with regular bills.

## Top Picks for 2025

### 1. Realty Income (O)

Known as "The Monthly Dividend Company," Realty Income is a REIT that has paid consistent dividends for over 50 years. It focuses on retail properties with high occupancy rates.

> "Realty Income is the gold standard for monthly dividend payers."

## Risks to Consider

Just because a stock pays monthly doesn't mean it's safe. Always check the payout ratio.
```
