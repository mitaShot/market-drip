/**
 * JSON 포스트를 HTML로 변환하는 렌더러
 */
import { translations } from './translations';

/**
 * 텍스트 콘텐츠를 HTML로 변환 (줄바꿈, 볼드 처리)
 */
function formatContent(text) {
    if (!text) return '';

    // 모든 줄바꿈을 \n으로 통일 (CRLF -> LF)
    let normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let html = escapeHtml(normalizedText);

    // **텍스트** → <strong>텍스트</strong> 변환
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 줄바꿈 처리: \n 및 \\n을 <br>로 변환
    html = html.replace(/\n/g, '<br>').replace(/\\n/g, '<br>');

    // 문장 끝(. ? !)에서 다음 문장 시작 전에 <br> 삽입
    // 수정: 숫자 뒤의 마침표(데시멀 등)는 무시하도록 조건 추가
    html = html.replace(/([^0-9][.?!])\s+([가-힣a-zA-Z*])/g, '$1<br>$2');

    return html;
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
/**
 * Claims (Evidence) 렌더링
 */
function renderClaims(claims, t) {
    if (!claims || !Array.isArray(claims) || claims.length === 0) return '';

    let html = '<div class="claims-container" style="margin-top:16px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">';
    html += '<h4 style="margin:0 0 12px 0; font-size:0.95rem; color:#475569; display:flex; align-items:center; gap:6px;">🔍 Evidence & Claims</h4>';
    html += '<ul style="margin:0; padding-left:20px; color:#334155; font-size:0.95rem; line-height:1.6;">';

    claims.forEach(item => {
        html += '<li style="margin-bottom:8px;">';
        html += '<span>' + formatContent(item.claim) + '</span>';
        if (item.source_url) {
            html += ' <a href="' + escapeHtml(item.source_url) + '" target="_blank" rel="noopener" style="color:#3b82f6; text-decoration:none; font-size:0.85rem; margin-left:4px;">[Source]</a>';
        }
        html += '</li>';
    });

    html += '</ul></div>';
    return html;
}

/**
 * Hook Summary (3초 요약) 렌더링
 */
function renderHookSummary(hook, t) {
    if (!hook || !hook.points) return '';
    let html = '<div class="hook-summary" style="background:#f0f7ff; border-radius:12px; padding:24px; margin:24px 0; border:1px solid #d0e7ff;">';
    html += '<h3 style="margin:0 0 16px 0; display:flex; align-items:center; gap:8px; color:#0056b3;"><span style="font-size:1.2rem;">💡</span> ' + escapeHtml(hook.heading || 'Summary') + '</h3>';
    html += '<ul style="margin:0; padding-left:20px; color:#334155; line-height:1.6;">';
    hook.points.forEach(point => {
        html += '<li style="margin-bottom:8px;">' + formatContent(point) + '</li>';
    });
    html += '</ul>';

    if (hook.claims) {
        html += renderClaims(hook.claims, t);
    }

    html += '</div>';
    return html;
}

/**
 * Key Statistics 렌더링 (다채롭고 세련된 표 디자인)
 */
function renderKeyStatistics(stats, t) {
    if (!stats) return '';
    const hasNA = Object.values(stats).some(val => val && String(val).toUpperCase() === 'N/A');
    if (hasNA) return '';

    const labels = t.stats || {};
    const fields = [
        { key: 'current_price', label: labels.current_price || 'Price', icon: '💰', theme: '#1a73e8', bg: '#e8f0fe' },
        { key: 'todays_change', label: labels.todays_change || 'Change', icon: '📈', theme: '#d93025', bg: '#fce8e6' },
        { key: 'target_price_avg', label: labels.target_price_avg || 'Target', icon: '🎯', theme: '#188038', bg: '#e6f4ea' },
        { key: 'market_cap', label: labels.market_cap || 'Mkt Cap', icon: '🏢', theme: '#5f6368', bg: '#f1f3f4' },
        { key: 'rsi_index', label: labels.rsi_index || 'RSI', icon: '📉', theme: '#f29900', bg: '#fef7e0' },
        { key: 'sentiment', label: labels.sentiment || 'Sentiment', icon: '🎭', theme: '#9c27b0', bg: '#f3e5f5' }
    ];

    let html = '<div class="key-stats-wrapper" style="margin: 24px auto; border: 1px solid #eef2f6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); max-width: fit-content;">';
    html += '<table style="width: auto; min-width: 300px; border-collapse: collapse; background: #fff; font-size: 0.85rem;">';

    fields.forEach((f) => {
        if (stats[f.key]) {
            let rawValue = String(stats[f.key]);
            const marketMap = t.marketValues || {};
            Object.keys(marketMap).forEach(engTerm => {
                const escapedTerm = engTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                rawValue = rawValue.replace(new RegExp(escapedTerm, 'g'), marketMap[engTerm]);
            });

            const isPositive = rawValue.includes('+');
            const isNegative = rawValue.includes('-');
            let valueColor = '#202124';
            if (f.key === 'todays_change' || f.key === 'current_price') {
                if (isPositive) valueColor = '#d32f2f';
                else if (isNegative) valueColor = '#1976d2';
            }

            html += '<tr style="border-bottom: 1px solid #f1f3f4;">';
            html += '<td style="padding: 10px 16px; background: ' + f.bg + '; width: 110px;">';
            html += '<span style="display: flex; align-items: center; gap: 8px; color: ' + f.theme + '; font-weight: 600;">';
            html += '<span style="font-size: 1.1rem;">' + f.icon + '</span><span>' + f.label + '</span></span></td>';
            html += '<td style="padding: 10px 20px; text-align: right; font-weight: 700; color: ' + valueColor + '; white-space: nowrap; background: #fff;">' + escapeHtml(rawValue) + '</td>';
            html += '</tr>';
        }
    });

    html += '</table></div>';
    return html;
}

/**
 * FAQ 렌더링
 */
function renderFaq(faq, t) {
    if (!faq || !Array.isArray(faq)) return '';
    let html = '<div class="faq-container" style="margin-top:40px; border-top:2px solid #e2e8f0; padding-top:32px;">';
    html += '<h2 style="margin-bottom:24px;">' + escapeHtml(t.faq || 'Frequently Asked Questions') + '</h2>';
    faq.forEach(item => {
        html += '<div style="margin-bottom:20px; background:#f8fafc; border-radius:8px; padding:20px;">';
        html += '<div style="font-weight:700; color:#1e293b; margin-bottom:8px; display:flex; gap:8px;"><span>Q.</span> ' + escapeHtml(item.question) + '</div>';
        html += '<div style="color:#475569; line-height:1.5; padding-left:24px;">' + formatContent(item.answer) + '</div>';
        html += '</div>';
    });
    html += '</div>';
    return html;
}

/**
 * JSON sections 배열을 HTML 문자열로 변환
 */
export function renderJsonSectionsToHtml(sections, postId, lang = 'en', jsonData = {}) {
    if (!sections || !Array.isArray(sections)) return '';
    const t = translations[lang]?.post || translations['en'].post;

    return sections.map((section, index) => {
        let sectionHtml = '';
        let heading = t[section.type] || section.heading;

        switch (section.type) {
            case 'overview':
            case 'analysis':
            case 'price_trends':
            case 'insights':
            case 'glossary':
            case 'news':
                sectionHtml = '<div class="section-content">' + formatContent(section.content || '') + '</div>';
                if (section.type === 'news' && section.sources?.length > 0) {
                    sectionHtml += '<div class="sources-container" style="background:#f8f9fa;border-radius:8px;padding:16px;margin:20px 0;">';
                    sectionHtml += '<h4 style="margin:0 0 12px 0;color:#333;">' + escapeHtml(t.sources) + '</h4><div class="source-links" style="display:flex;flex-wrap:wrap;gap:8px;">';
                    section.sources.forEach(source => {
                        sectionHtml += '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:8px 14px;background:#fff;border:1px solid #ddd;border-radius:20px;text-decoration:none;color:#0066cc;font-size:14px;transition:all 0.2s;">' + escapeHtml(source.name) + ' <span style="margin-left:6px;">↗</span></a>';
                    });
                    sectionHtml += '</div></div>';
                }
                break;
            case 'company_descriptions':
                if (section.companies?.length > 0) {
                    sectionHtml = '<div class="company-descriptions-container" style="margin: 24px 0; display: flex; flex-direction: column; gap: 12px;">';
                    section.companies.forEach((company, cIdx) => {
                        const uniqueId = `company-desc-${index}-${cIdx}`;
                        sectionHtml += '<div class="company-desc-item" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; transition: all 0.2s;">';
                        sectionHtml += '<div onclick="const el=document.getElementById(\'' + uniqueId + '\');const icon=document.getElementById(\'' + uniqueId + '-icon\');if(el.style.display===\'none\'){el.style.display=\'block\';icon.style.transform=\'rotate(180deg)\';this.parentElement.style.borderColor=\'#667eea\';this.parentElement.style.boxShadow=\'0 4px 12px rgba(102,126,234,0.1)\';}else{el.style.display=\'none\';icon.style.transform=\'rotate(0deg)\';this.parentElement.style.borderColor=\'#e2e8f0\';this.parentElement.style.boxShadow=\'none\';}" style="padding: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none; background: #fff;">';
                        sectionHtml += '<h4 style="margin: 0; color: #1e293b; display: flex; align-items: center; gap: 12px; font-size: 1rem;">';
                        sectionHtml += '<span style="background: #ebf2ff; color: #3b82f6; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; border: 1px solid #dbeafe;">' + escapeHtml(company.ticker) + '</span>';
                        sectionHtml += '<span style="font-weight: 600;">' + escapeHtml(company.name) + '</span></h4>';
                        sectionHtml += '<span id="' + uniqueId + '-icon" style="transition: transform 0.3s; color: #64748b; font-size: 0.8rem;">▼</span></div>';
                        sectionHtml += '<div id="' + uniqueId + '" style="display: none; padding: 0 16px 16px 16px; background: #fff;"><div style="padding-top: 12px; border-top: 1px solid #f1f5f9; color: #475569; line-height: 1.7; font-size: 0.95rem;">' + formatContent(company.description) + '</div></div></div>';
                    });
                    sectionHtml += '</div>';
                }
                break;
            case 'outlook':
                if (section.bull_case) sectionHtml += '<div class="outlook-bull" style="background:#e8f5e9;border-left:4px solid #4caf50;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;"><h4 style="margin:0 0 8px 0;">' + escapeHtml(t.bull_case) + '</h4><p style="margin:0;">' + formatContent(section.bull_case) + '</p></div>';
                if (section.bear_case) sectionHtml += '<div class="outlook-bear" style="background:#ffebee;border-left:4px solid #f44336;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;"><h4 style="margin:0 0 8px 0;">' + escapeHtml(t.bear_case) + '</h4><p style="margin:0;">' + formatContent(section.bear_case) + '</p></div>';
                if (section.strategy) sectionHtml += '<div class="outlook-strategy" style="background:#fff3e0;border-left:4px solid #ff9800;padding:16px;margin:16px 0;border-radius:0 8px 8px 0;"><h4 style="margin:0 0 8px 0;">' + escapeHtml(t.strategy) + '</h4><p style="margin:0;">' + formatContent(section.strategy) + '</p></div>';
                break;
            case 'earnings_calendar':
                if (section.earnings?.length > 0) {
                    const earningsT = t.earnings || {};
                    const tableId = `earnings-table-${postId}-${index}`;
                    const dates = [...new Set(section.earnings.map(e => e.date))].sort();
                    const months = [...new Set(dates.map(d => d.substring(0, 7)))].sort();

                    sectionHtml += '<div class="earnings-filters" style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">';
                    sectionHtml += '<span style="font-weight:600;color:#64748b;font-size:0.9rem;">📅 ' + (lang === 'ko' ? '기능 필터' : 'Filter') + ':</span>';
                    sectionHtml += '<select id="filter-month" onchange="filterEarningsTable(\'' + tableId + '\', \'month\')" style="padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:0.9rem;outline:none;cursor:pointer;">';
                    sectionHtml += '<option value="">' + (lang === 'ko' ? '전체 월' : 'All Months') + '</option>';
                    months.forEach(m => sectionHtml += '<option value="' + m + '">' + m + '</option>');
                    sectionHtml += '</select>';
                    sectionHtml += '<select id="filter-date" onchange="filterEarningsTable(\'' + tableId + '\', \'date\')" style="padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:0.9rem;outline:none;cursor:pointer;">';
                    sectionHtml += '<option value="">' + (lang === 'ko' ? '전체 날짜' : 'All Dates') + '</option>';
                    dates.forEach(d => sectionHtml += '<option value="' + d + '">' + d + '</option>');
                    sectionHtml += '</select>';
                    sectionHtml += '<span style="margin-left:auto; font-size:0.85rem; color:#64748b; display:flex; align-items:center; gap:4px;">💡 ' + (lang === 'ko' ? '티커를 클릭하면 기업 설명을 볼 수 있습니다.' : lang === 'ja' ? 'ティッカーをクリックすると企業説明が表示されます。' : 'Click ticker for company info.') + '</span></div>';

                    sectionHtml += '<div class="earnings-calendar-wrapper" style="overflow-y:auto;overflow-x:hidden;max-height:500px;margin:24px 0;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.05);scroll-behavior:smooth;">';
                    sectionHtml += '<table id="' + tableId + '" style="width:100%;border-collapse:collapse;background:#fff;table-layout:auto;">';
                    sectionHtml += '<thead><tr style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;">';
                    const headers = [
                        { key: 'ticker', label: earningsT.ticker || 'Ticker', align: 'center' },
                        { key: 'date', label: earningsT.date || 'Date', align: 'center' },
                        { key: 'eps_est', label: earningsT.eps_est || 'Est. EPS', align: 'right' },
                        { key: 'eps_actual', label: earningsT.eps_actual || 'Act. EPS', align: 'right' },
                        { key: 'rev_est', label: earningsT.rev_est || 'Est. Rev', align: 'right' },
                        { key: 'rev_actual', label: earningsT.rev_actual || 'Act. Rev', align: 'right' }
                    ];
                    headers.forEach((header, i) => {
                        let padding = '14px 2px';
                        if (i === 5) padding = '14px 14px 14px 2px'; // 마지막 컬럼 스크롤 여유
                        sectionHtml += '<th onclick="sortTable(\'' + tableId + '\', ' + i + ')" style="position:sticky;top:0;z-index:10;background:#f8fafc;box-shadow:inset 0 -2px 0 #cbd5e0;padding:' + padding + ';text-align:' + header.align + ';font-weight:700;font-size:0.9rem;white-space:nowrap;cursor:pointer;user-select:none;color:#1e293b;" title="Click to sort">' + header.label + ' <span style="font-size:0.75rem;opacity:0.7;">↕</span></th>';
                    });
                    sectionHtml += '</tr></thead><tbody>';
                    section.earnings.forEach((item, idx) => {
                        const bgColor = idx % 2 === 0 ? '#f8fafc' : '#fff';
                        const sectorLabel = (t.sectors || {})[item.sector] || item.sector || 'N/A';
                        const isUnannounced = !item.eps_actual || item.eps_actual === '-';
                        const unannouncedClass = isUnannounced ? 'unannounced-row' : '';
                        sectionHtml += '<tr class="earnings-row ' + unannouncedClass + '" data-date="' + item.date + '" style="border-bottom:1px solid #e2e8f0;background:' + bgColor + ';transition:background 0.2s;" onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'' + bgColor + '\'">';
                        sectionHtml += '<td style="padding:8px 2px;text-align:center;"><span class="ticker-trigger" onclick="showCompanyModal(\'' + escapeHtml(item.ticker) + '\', \'' + escapeHtml((item.company || item.ticker)).replace(/'/g, "\\'") + '\', \'' + escapeHtml((item.description || '').replace(/'/g, "\\'").replace(/\n/g, "\\n")) + '\', \'' + escapeHtml(item.website || '') + '\', \'' + escapeHtml(sectorLabel).replace(/'/g, "\\'") + '\')" style="cursor:pointer;color:#3b82f6;font-weight:600;white-space:nowrap;padding:2px 5px;border-radius:6px;background:#eff6ff;border:1px solid #dbeafe;">' + escapeHtml(item.ticker) + '</span></td>';
                        sectionHtml += '<td style="padding:8px 0 8px 8px;text-align:center;color:#475569;white-space:nowrap;">' + escapeHtml(item.date) + '</td>';
                        sectionHtml += '<td style="padding:8px 8px 8px 0;text-align:right;font-weight:600;color:#059669;white-space:nowrap;">' + escapeHtml(item.eps_est || 'N/A') + '</td>';
                        sectionHtml += '<td style="padding:8px 2px;text-align:right;font-weight:700;color:' + (item.eps_actual && item.eps_actual !== '-' ? '#2563eb' : '#94a3b8') + ';white-space:nowrap;">' + escapeHtml(item.eps_actual || '-') + '</td>';
                        sectionHtml += '<td style="padding:8px 2px;text-align:right;color:#64748b;white-space:nowrap;">' + escapeHtml(item.rev_est || 'N/A') + '</td>';
                        sectionHtml += '<td style="padding:8px 14px 8px 2px;text-align:right;font-weight:600;color:' + (item.rev_actual && item.rev_actual !== '-' ? '#2563eb' : '#94a3b8') + ';white-space:nowrap;">' + escapeHtml(item.rev_actual || '-') + '</td></tr>';
                    });
                    sectionHtml += '</tbody></table></div>';
                    sectionHtml += '<div id="company-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);"><div style="background:#fff;width:100%;max-width:500px;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);animation:modalIn 0.3s ease-out;"><div style="padding:24px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;justify-content:space-between;align-items:center;"><h3 id="modal-title" style="margin:0;font-size:1.25rem;">Company Info</h3><button onclick="closeCompanyModal()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:1.5rem;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:0;">&times;</button></div><div style="padding:24px;max-height:60vh;overflow-y:auto;"><div style="display:flex;gap:10px;align-items:center;margin-bottom:20px;flex-wrap:wrap;"><div id="modal-ticker-badge" style="display:inline-block;padding:5px 12px;background:#eef2ff;color:#4f46e5;border-radius:8px;font-weight:700;font-size:0.85rem;border:1px solid #dbeafe;line-height:1.2;">TICKER</div><div id="modal-sector" style="display:inline-block;padding:5px 12px;background:#f0fdf4;color:#16a34a;border-radius:8px;font-weight:700;font-size:0.85rem;border:1px solid #dcfce7;line-height:1.2;">SECTOR</div></div><p id="modal-desc" style="margin:0;color:#475569;line-height:1.7;font-size:1rem;"></p><div id="modal-links" style="margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;"><a id="modal-website" href="#" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;color:#2563eb;text-decoration:none;font-weight:600;font-size:0.9rem;">🌐 ' + (lang === 'ko' ? '공식 홈페이지 방문' : 'Visit Official Website') + '</a></div></div></div></div><style>@keyframes modalIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }</style>';
                    sectionHtml += '<script>setTimeout(function(){ if(typeof scrollToToday === "function") scrollToToday("' + tableId + '"); }, 500);</script>';
                }
                break;
            default:
                if (section.content) sectionHtml = '<div class="section-content">' + formatContent(section.content) + '</div>';
        }

        if (section.claims) {
            sectionHtml += renderClaims(section.claims, t);
        }

        let finalHtml = '<section style="margin-bottom: 32px;">';
        if (heading) {
            finalHtml += '<h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">' + escapeHtml(heading) + '</h2>';
        }
        finalHtml += sectionHtml + '</section>';

        if (index === 1) {
            if (jsonData.chart) {
                const chart = jsonData.chart;
                finalHtml += '<figure class="post-chart-wrapper" style="margin: 28px 0; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #ebf0f5; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">';
                finalHtml += '<img src="/posts/img/' + chart.chart_filename + '" alt="' + escapeHtml(chart.image_alt || '') + '" style="width:100%; height:auto; display:block;" referrerpolicy="no-referrer" />';
                finalHtml += '<figcaption style="padding: 20px; background: #fcfdfe; border-top: 1px solid #ebf0f5;"><div style="font-weight: 700; color: #1a202c; margin-bottom: 12px; font-size: 1.1rem; line-height: 1.4;">' + escapeHtml(chart.image_caption || '') + '</div>';
                if (chart.analysis) finalHtml += '<div style="font-size: 0.92rem; color: #4a5568; line-height: 1.6; background: #fff; padding: 14px; border-radius: 8px; border: 1px dashed #cbd5e0;">' + formatContent(chart.analysis) + '</div>';
                finalHtml += '</figcaption></figure>';
            } else if (postId && postId !== 'earnings') {
                finalHtml += '<img src="/posts/img/' + postId + '_inner.webp" alt="Article illustration" class="post-inner-image" style="width:100%;max-width:800px;border-radius:8px;margin:20px 0;" referrerpolicy="no-referrer" />';
            }
        }
        return finalHtml;
    }).join('');
}

/**
 * JSON 포스트 데이터를 표준 포스트 형식으로 변환
 */
export function parseJsonPost(jsonData, id, lang) {
    const seo = jsonData.seo || jsonData;
    const content = jsonData.content || jsonData;
    const t = translations[lang]?.post || translations['en'].post;
    const coverImageUrl = jsonData.images?.cover?.url || jsonData.coverImageUrl || `/posts/img/${id}_cover.webp`;

    let htmlContent = '';
    if (content.hook_summary) htmlContent += renderHookSummary(content.hook_summary, t);
    htmlContent += renderJsonSectionsToHtml(content.sections, id, lang, jsonData);
    if (content.faq) htmlContent += renderFaq(content.faq, t);

    return {
        title: seo.title || '',
        date: seo.published_date || seo.date || '',
        category: seo.category || '',
        author: seo.author || '',
        excerpt: content.excerpt || seo.meta_description || '',
        image: coverImageUrl,
        tags: seo.tags || [],
        contentHtml: htmlContent,
        _raw: jsonData
    };
}
