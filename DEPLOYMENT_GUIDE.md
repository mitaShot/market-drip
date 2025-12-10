# Market Drip 배포 및 업데이트 가이드

이 문서는 Market Drip 블로그를 Cloudflare Pages에 배포하고, 새로운 글을 업로드하는 방법을 설명합니다.

## 1. Cloudflare Pages 호스팅 원리
Cloudflare Pages는 **Git 저장소(GitHub 등)**와 연결되어 동작합니다.
여러분이 컴퓨터에서 파일을 수정하고 GitHub에 "푸시(Push)"하면, Cloudflare가 이를 감지하고 자동으로 사이트를 새로 빌드해서 배포합니다.

## 2. 최초 배포 설정 (한 번만 수행)
1.  **GitHub에 코드 올리기**: 현재 프로젝트를 GitHub 저장소(Repository)에 업로드합니다.
2.  **Cloudflare Pages 접속**: Cloudflare 대시보드에서 'Pages' 메뉴로 이동합니다.
3.  **프로젝트 생성**: 'Connect to Git'을 선택하고 GitHub 저장소를 연결합니다.
4.  **빌드 설정**:
    *   **Framework Preset**: `Next.js (Static Export)` 선택
    *   **Build Command**: `npx @cloudflare/next-on-pages@1` 또는 `npm run build`
    *   **Output Directory**: `out`
5.  **Deploy**: 버튼을 누르면 배포가 완료됩니다.

## 3. 새로운 글 업로드 방법 (일상적인 작업)

글을 올리는 것은 파일을 추가하고 저장하는 과정과 같습니다.

### 1단계: 글 작성
내 컴퓨터의 `posts/` 폴더에 새로운 마크다운 파일(예: `new-stock-analysis.md`)을 만듭니다. (`CONTENT_FORMAT.md` 참조)

### 2단계: 변경 사항 저장 (Git Commit & Push)
터미널에서 다음 명령어를 입력하여 변경 사항을 GitHub로 보냅니다.

```bash
# 1. 변경된 파일 모두 선택
git add .

# 2. 변경 내용에 대한 메모 작성 (커밋)
git commit -m "새로운 글 추가: OOO 종목 분석"

# 3. GitHub로 전송 (푸시)
git push origin main
```

### 3단계: 자동 배포 확인
`git push`를 하는 순간, Cloudflare가 자동으로 감지하여 약 1~2분 뒤에 실제 사이트에 새 글이 올라갑니다.

---
**요약**: 내 컴퓨터에서 글(`md` 파일)을 쓰고 -> 저장해서 -> GitHub에 올리기만 하면 끝!
