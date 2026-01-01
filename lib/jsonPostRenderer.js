/**
 * JSON 포스트를 HTML로 변환하는 렌더러
 */

/**
 * JSON sections 배열을 HTML 문자열로 변환
 * @param {Array} sections - content.sections 배열
 * @returns {string} HTML 문자열
 */
export function renderJsonSectionsToHtml(sections, postId) {
    if (!sections || !Array.isArray(sections)) {
        return '';
    }

    return sections.map((section, index) => {
        let html = '';

        // 섹션 제목
        if (section.heading) {
            html += `<h2>${escapeHtml(section.heading)}</h2>\n`;
        }

        // 섹션 타입별 렌더링
        switch (section.type) {
            case 'overview':
            case 'analysis':
            case 'price_trends':
            case 'insights':
                html += `<p>${escapeHtml(section.content)}</p>\n`;
                break;

            case 'news':
                if (section.content) {
                    html += `<p>${escapeHtml(section.content)}</p>\n`;
                }
                if (section.sources && section.sources.length > 0) {
                    html += '<div class="sources">\n<h4>참고 자료</h4>\n<ul>\n';
                    section.sources.forEach(source => {
                        html += `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a></li>\n`;
                    });
                    html += '</ul>\n</div>\n';
                }
                break;

            case 'outlook':
                if (section.bull_case) {
                    html += `<div class="outlook-bull">\n<h4>📈 긍정적 시나리오</h4>\n<p>${escapeHtml(section.bull_case)}</p>\n</div>\n`;
                }
                if (section.bear_case) {
                    html += `<div class="outlook-bear">\n<h4>📉 부정적 시나리오</h4>\n<p>${escapeHtml(section.bear_case)}</p>\n</div>\n`;
                }
                if (section.strategy) {
                    html += `<div class="outlook-strategy">\n<h4>💡 투자 전략</h4>\n<p>${escapeHtml(section.strategy)}</p>\n</div>\n`;
                }
                break;

            default:
                // 기본: content가 있으면 그대로 출력
                if (section.content) {
                    html += `<p>${escapeHtml(section.content)}</p>\n`;
                }
        }

        // 첫 번째 섹션 뒤에 inner 이미지 삽입 (이미지 없으면 숨김)
        if (index === 0 && postId) {
            html += `<img src="/posts/img/${postId}_inner.webp" alt="" class="post-inner-image" onerror="this.style.display='none'" style="width:100%;max-width:800px;border-radius:8px;margin:20px 0;" />\n`;
        }

        return html;
    }).join('\n');
}

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * JSON 포스트 데이터를 표준 포스트 형식으로 변환
 * @param {Object} jsonData - 파싱된 JSON 데이터
 * @param {string} id - 포스트 ID
 * @param {string} lang - 언어 코드
 * @returns {Object} 표준 포스트 데이터
 */
export function parseJsonPost(jsonData, id, lang) {
    const seo = jsonData.seo || {};
    const content = jsonData.content || {};

    // 이미지 경로: posts/img/{id}_cover.webp 형식으로 자동 생성
    // 기존 images.cover.url이 있으면 그것을 우선 사용
    const coverImageUrl = jsonData.images?.cover?.url || `/posts/img/${id}_cover.webp`;

    return {
        // frontmatter 호환 데이터
        title: seo.title || '',
        date: seo.published_date || '',
        category: seo.category || '',
        author: seo.author || '',
        excerpt: content.excerpt || seo.meta_description || '',
        image: coverImageUrl,
        tags: seo.tags || [],
        // HTML 콘텐츠
        contentHtml: renderJsonSectionsToHtml(content.sections, id),
        // 원본 데이터 (필요시 활용)
        _raw: jsonData
    };
}
