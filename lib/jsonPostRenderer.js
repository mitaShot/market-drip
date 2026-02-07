/**
 * JSON 포스트를 HTML로 변환하는 렌더러
 */
import { translations } from './translations';

/**
 * 텍스트 콘텐츠를 HTML로 변환 (줄바꿈, 볼드 처리)
 */
function formatContent(text) {
    if (!text) return '';

    // 이스케이프 먼저 처리
    let html = escapeHtml(text);

    // **텍스트** → <strong>텍스트</strong> 변환
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 줄바꿈 처리: \n을 <br>로 변환
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/\\n/g, '<br>');

    // 문장 끝(. ? !)에서 다음 문장 시작 전에 <br> 삽입
    html = html.replace(/([.?!]) ([가-힣a-zA-Z*])/g, '$1<br>$2');

    return html;
}

/**
 * JSON sections 배열을 HTML 문자열로 변환
 * @param {Array} sections - content.sections 배열
 * @param {string} postId - 포스트 ID
 * @param {string} lang - 언어 코드
 * @returns {string} HTML 문자열
 */
export function renderJsonSectionsToHtml(sections, postId, lang = 'en') {
    if (!sections || !Array.isArray(sections)) {
        return '';
    }

    // 해당 언어의 번역 가져오기 (없으면 영어 기본)
    const t = translations[lang]?.post || translations['en'].post;
    const englishT = translations['en'].post;

    return sections.map((section, index) => {
        let html = '';

        // 섹션 제목: 영문 기본 제목일 경우 해당 언어로 번역
        let heading = section.heading;
        if (lang !== 'en' && heading) {
            // 정확히 일치하거나 소문자 일치 시 번역 적용
            const typeKey = section.type;
            if (heading === englishT[typeKey] || heading.toLowerCase() === englishT[typeKey]?.toLowerCase()) {
                heading = t[typeKey] || heading;
            }
        }

        if (heading) {
            html += `<h2 style="display: flex; align-items: center; gap: 10px;">${escapeHtml(heading)}`;

            // 신규 지원: impact_level 표시
            if (section.impact_level) {
                const colors = {
                    high: { bg: '#ffebee', text: '#c62828' },
                    medium: { bg: '#fff3e0', text: '#ef6c00' },
                    low: { bg: '#e8f5e9', text: '#2e7d32' }
                };
                const style = colors[section.impact_level.toLowerCase()] || colors.medium;
                html += ` <span style="font-size: 0.7em; padding: 2px 8px; border-radius: 4px; background: ${style.bg}; color: ${style.text}; text-transform: uppercase;">${section.impact_level}</span>`;
            }

            html += `</h2>\n`;
        }

        // 섹션 타입별 렌더링
        switch (section.type) {
            case 'overview':
            case 'analysis':
            case 'price_trends':
            case 'insights':
                html += `<div class="section-content">${formatContent(section.content)}</div>\n`;
                break;

            case 'news':
                if (section.content) {
                    html += `<div class="section-content">${formatContent(section.content)}</div>\n`;
                }
                if (section.sources && section.sources.length > 0) {
                    html += '<div class="sources-container" style="background:#f8f9fa;border-radius:8px;padding:16px;margin:20px 0;">\n';
                    html += `<h4 style="margin:0 0 12px 0;color:#333;">${t.sources}</h4>\n`;
                    html += '<div class="source-links" style="display:flex;flex-wrap:wrap;gap:8px;">\n';
                    section.sources.forEach(source => {
                        html += `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:8px 14px;background:#fff;border:1px solid #ddd;border-radius:20px;text-decoration:none;color:#0066cc;font-size:14px;transition:all 0.2s;">${escapeHtml(source.name)} <span style="margin-left:6px;">↗</span></a>\n`;
                    });
                    html += '</div>\n</div>\n';
                }
                break;

            case 'outlook':
                if (section.bull_case) {
                    html += `<div class="outlook-bull" style="background:#e8f5e9;border-left:4px solid #4caf50;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">\n<h4 style="margin:0 0 8px 0;">${t.bull_case}</h4>\n<p style="margin:0;">${formatContent(section.bull_case)}</p>\n</div>\n`;
                }
                if (section.bear_case) {
                    html += `<div class="outlook-bear" style="background:#ffebee;border-left:4px solid #f44336;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">\n<h4 style="margin:0 0 8px 0;">${t.bear_case}</h4>\n<p style="margin:0;">${formatContent(section.bear_case)}</p>\n</div>\n`;
                }
                if (section.strategy) {
                    html += `<div class="outlook-strategy" style="background:#fff3e0;border-left:4px solid #ff9800;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">\n<h4 style="margin:0 0 8px 0;">${t.strategy}</h4>\n<p style="margin:0;">${formatContent(section.strategy)}</p>\n</div>\n`;
                }
                break;

            default:
                // 기본: content가 있으면 그대로 출력
                if (section.content) {
                    html += `<div class="section-content">${formatContent(section.content)}</div>\n`;
                }
        }

        // 두 번째 섹션 뒤에 inner 이미지 삽입 (이미지 없으면 숨김)
        if (index === 1 && postId) {
            html += `<img src="/posts/img/${postId}_inner.webp" alt="Article illustration for ${postId}" class="post-inner-image" onerror="if(!this.src.endsWith('.png')){this.src='/posts/img/${postId}_inner.png';}else{this.style.display='none'}" style="width:100%;max-width:800px;border-radius:8px;margin:20px 0;" />\n`;
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
 * Hook Summary (3초 요약) 렌더링
 */
function renderHookSummary(hook, t) {
    if (!hook || !hook.points) return '';
    let html = `<div class="hook-summary" style="background:#f0f7ff; border-radius:12px; padding:24px; margin:24px 0; border:1px solid #d0e7ff;">`;
    html += `<h3 style="margin:0 0 16px 0; display:flex; align-items:center; gap:8px; color:#0056b3;"><span style="font-size:1.2rem;">💡</span> ${escapeHtml(hook.heading || 'Summary')}</h3>`;
    html += `<ul style="margin:0; padding-left:20px; color:#334155; line-height:1.6;">`;
    hook.points.forEach(point => {
        html += `<li style="margin-bottom:8px;">${formatContent(point)}</li>`;
    });
    html += `</ul></div>`;
    return html;
}

/**
 * Key Statistics 렌더링 (프리미엄 카드 디자인)
 */
function renderKeyStatistics(stats, t) {
    if (!stats) return '';
    let html = `<div class="key-stats-container" style="margin: 30px 0;">`;
    html += `<div class="key-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">`;

    const fields = [
        { key: 'current_price', label: 'Current Price', icon: '💰', color: '#1a73e8' },
        { key: 'todays_change', label: 'Daily Change', icon: '📈', color: '#d93025' },
        { key: 'target_price_avg', label: 'Analyst Target', icon: '🎯', color: '#188038' },
        { key: 'market_cap', label: 'Market Cap', icon: '🏢', color: '#5f6368' },
        { key: 'rsi_index', label: 'RSI Index', icon: '📉', color: '#f29900' },
        { key: 'sentiment', label: 'Market Sentiment', icon: '🎭', color: '#9c27b0' }
    ];

    fields.forEach(f => {
        if (stats[f.key]) {
            const rawValue = stats[f.key];
            const isPositive = rawValue.includes('+');
            const isNegative = rawValue.includes('-');

            // 등락률에 따른 자동 색상 지정
            let valueColor = '#1e293b';
            if (f.key === 'todays_change' || f.key === 'current_price') {
                if (isPositive) valueColor = '#d32f2f';
                else if (isNegative) valueColor = '#1976d2';
            }

            html += `
            <div class="stat-card" style="
                background: #ffffff;
                border: 1px solid #eef2f6;
                border-left: 4px solid ${f.color};
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            ">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                    <span style="font-size: 1.1rem;">${f.icon}</span>
                    <span style="font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em;">${f.label}</span>
                </div>
                <div style="font-size: 1.35rem; font-weight: 800; color: ${valueColor}; letter-spacing: -0.02em;">
                    ${escapeHtml(rawValue)}
                </div>
            </div>`;
        }
    });

    html += `</div></div>`;
    return html;
}

/**
 * FAQ 렌더링
 */
function renderFaq(faq, t) {
    if (!faq || !Array.isArray(faq)) return '';
    let html = `<div class="faq-container" style="margin-top:40px; border-top:2px solid #e2e8f0; padding-top:32px;">`;
    html += `<h2 style="margin-bottom:24px;">Frequently Asked Questions</h2>`;
    faq.forEach(item => {
        html += `<div style="margin-bottom:20px; background:#f8fafc; border-radius:8px; padding:20px;">
            <div style="font-weight:700; color:#1e293b; margin-bottom:8px; display:flex; gap:8px;"><span>Q.</span> ${escapeHtml(item.question)}</div>
            <div style="color:#475569; line-height:1.5; padding-left:24px;">${formatContent(item.answer)}</div>
        </div>`;
    });
    html += `</div>`;
    return html;
}

/**
 * JSON 포스트 데이터를 표준 포스트 형식으로 변환 (신규/기본 포맷 모두 지원)
 * @param {Object} jsonData - 파싱된 JSON 데이터
 * @param {string} id - 포스트 ID
 * @param {string} lang - 언어 코드
 * @returns {Object} 표준 포스트 데이터
 */
export function parseJsonPost(jsonData, id, lang) {
    // 1. 데이터 소스 결정 (신규 포맷: seo/content, 기존 포맷: root)
    const seo = jsonData.seo || jsonData;
    const content = jsonData.content || jsonData;
    const t = translations[lang]?.post || translations['en'].post;

    // 이미지 경로 하이족 호환: images.cover.url -> coverImageUrl -> 기본값
    const coverImageUrl = jsonData.images?.cover?.url || jsonData.coverImageUrl || `/posts/img/${id}_cover.webp`;

    // 2. HTML 콘텐츠 조립
    let htmlContent = '';

    // 신규 필드 지원: 요약 및 통계
    if (content.hook_summary) htmlContent += renderHookSummary(content.hook_summary, t);
    if (content.key_statistics) htmlContent += renderKeyStatistics(content.key_statistics, t);

    // 기존 섹션 렌더링
    htmlContent += renderJsonSectionsToHtml(content.sections, id, lang);

    // 신규 필드 지원: FAQ
    if (content.faq) htmlContent += renderFaq(content.faq, t);

    return {
        // frontmatter 호환 데이터
        title: seo.title || '',
        date: seo.published_date || seo.date || '',
        category: seo.category || '',
        author: seo.author || '',
        excerpt: content.excerpt || seo.meta_description || '',
        image: coverImageUrl,
        tags: seo.tags || [],
        // HTML 콘텐츠
        contentHtml: htmlContent,
        // 원본 데이터 (필요시 활용)
        _raw: jsonData
    };
}
