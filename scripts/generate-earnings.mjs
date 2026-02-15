#!/usr/bin/env node

/**
 * S&P 500 어닝 캘린더 자동 생성 스크립트
 * Financial Modeling Prep (FMP) API를 사용하여 향후 1개월 실적 발표 일정을 가져옵니다.
 * Profile API로 회사명, 웹사이트, 섹터 정보를 캐싱합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FMP API 키 (환경 변수에서 가져오기)
const FMP_API_KEY = process.env.FMP_API_KEY;

if (!FMP_API_KEY) {
    console.error('❌ Error: FMP_API_KEY 환경 변수가 설정되지 않았습니다.');
    console.error('사용법: FMP_API_KEY=your_api_key npm run update-earnings');
    process.exit(1);
}

// 현재부터 데이터를 가져오는 범위를 계산 (2026년 1월 데이터 포함하도록 수정)
function getMonthRange() {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 14); // 2주 전부터 (무료 플랜 제한 고려)
    const fromDateStr = from.toISOString().split('T')[0];

    const to = new Date(now);
    to.setDate(now.getDate() + 30); // 30일 후까지
    to.setHours(23, 59, 59, 999);

    return {
        from: fromDateStr,
        to: to.toISOString().split('T')[0],
        updateDate: new Date().toISOString().split('T')[0] // 포스팅 날짜
    };
}

// FMP API에서 어닝 데이터 가져오기
async function fetchEarningsData(from, to) {
    const url = `https://financialmodelingprep.com/stable/earnings-calendar?from=${from}&to=${to}&apikey=${FMP_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`FMP API 오류: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('❌ API 요청 실패:', error.message);
        throw error;
    }
}

// FMP API에서 회사 프로필 가져오기 (회사명, 웹사이트, 섹터)
async function fetchCompanyProfile(ticker) {
    const url = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`⚠️  ${ticker} 프로필 조회 실패: ${response.status}`);
            return null;
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const profile = data[0];
            return {
                name: profile.companyName || ticker,
                website: profile.website || '',
                sector: profile.sector || 'N/A',
                description: profile.description || ''
            };
        }
        return null;
    } catch (error) {
        console.warn(`⚠️  ${ticker} 프로필 조회 오류:`, error.message);
        return null;
    }
}

// 회사 프로필 캐시 로드
function loadProfileCache() {
    const cacheFile = path.join(__dirname, '../data/company-profiles.json');
    try {
        if (fs.existsSync(cacheFile)) {
            const data = fs.readFileSync(cacheFile, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn('⚠️  캐시 로드 실패, 새로 시작:', error.message);
    }
    return {};
}

// 회사 프로필 캐시 저장
function saveProfileCache(cache) {
    const cacheFile = path.join(__dirname, '../data/company-profiles.json');
    const dataDir = path.dirname(cacheFile);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
}

async function getCompanyInfo(ticker, cache, lang) {
    if (cache[ticker]) {
        // 이미 해당 언어의 번역이 캐시에 있으면 바로 반환
        const hasTranslation = lang && lang !== 'en' && cache[ticker][`description_${lang}`];
        const hasDescription = cache[ticker].description && cache[ticker].description !== '';

        if (hasTranslation && hasDescription) {
            return {
                ...cache[ticker],
                description: cache[ticker][`description_${lang}`]
            };
        }

        // 영문이고 설명이 있는 경우 바로 반환
        if ((lang === 'en' || !lang) && hasDescription) {
            return cache[ticker];
        }
    }

    // 캐시에 티커가 없거나, 설명이 비어있으면 API 호출 시도
    let profile = cache[ticker] || {};
    if (!profile.description || profile.description === '') {
        console.log(`🔍 ${ticker} 프로필 상세 정보 조회 중...`);
        const freshProfile = await fetchCompanyProfile(ticker);
        if (freshProfile) {
            profile = { ...profile, ...freshProfile };
            cache[ticker] = profile;
        } else if (!profile.name) {
            profile = { name: ticker, website: '', sector: 'N/A', description: '' };
            cache[ticker] = profile;
        }
    }

    // 번역이 필요한 경우 수행하고 캐시에 저장
    if (lang && lang !== 'en' && !profile[`description_${lang}`]) {
        const translated = await translateDescription(profile.description, lang);
        cache[ticker][`description_${lang}`] = translated;
        return {
            ...profile,
            description: translated
        };
    }

    return profile;
}

// S&P 500 전체 티커 리스트 (stockanalysis.com에서 크롤링)
const SP500_TICKERS = new Set([
    'NVDA', 'AAPL', 'GOOG', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'AVGO', 'BRK.B',
    'WMT', 'LLY', 'JPM', 'XOM', 'V', 'JNJ', 'MU', 'MA', 'ORCL', 'COST',
    'ABBV', 'HD', 'BAC', 'PG', 'CVX', 'CAT', 'KO', 'AMD', 'GE', 'NFLX',
    'PLTR', 'CSCO', 'MRK', 'LRCX', 'PM', 'GS', 'AMAT', 'MS', 'WFC', 'RTX',
    'UNH', 'IBM', 'TMUS', 'INTC', 'MCD', 'AXP', 'PEP', 'LIN', 'GEV', 'VZ',
    'TXN', 'T', 'AMGN', 'ABT', 'NEE', 'C', 'GILD', 'KLAC', 'BA', 'TMO',
    'DIS', 'APH', 'ANET', 'CRM', 'BLK', 'ISRG', 'TJX', 'SCHW', 'ADI', 'DE',
    'LOW', 'BX', 'PFE', 'UNP', 'HON', 'ETN', 'DHR', 'LMT', 'QCOM', 'WELL',
    'UBER', 'SYK', 'ACN', 'NEM', 'COP', 'BKNG', 'PLD', 'APP', 'COF', 'MDT',
    'CB', 'PH', 'VRTX', 'BMY', 'SPGI', 'HCA', 'PGR', 'PANW', 'GLW', 'MCK',
    'CMCSA', 'MO', 'NOW', 'INTU', 'BSX', 'CME', 'ADBE', 'CRWD', 'SBUX', 'SO',
    'CEG', 'TT', 'UPS', 'HWM', 'CVS', 'NOC', 'DUK', 'WDC', 'WM', 'EQIX',
    'GD', 'MAR', 'NKE', 'STX', 'SNDK', 'SHW', 'KKR', 'MMM', 'FCX', 'AMT',
    'USB', 'PNC', 'WMB', 'FDX', 'ICE', 'RCL', 'ITW', 'ADP', 'JCI', 'ECL',
    'CRH', 'SNPS', 'EMR', 'CMI', 'REGN', 'CDNS', 'ORLY', 'BK', 'MDLZ', 'MNST',
    'PWR', 'CL', 'DELL', 'CI', 'CTAS', 'ELV', 'MSI', 'MCO', 'CSX', 'SLB',
    'CVNA', 'SPG', 'GM', 'ABNB', 'TDG', 'APO', 'HLT', 'KMI', 'NSC', 'COR',
    'WBD', 'AEP', 'TEL', 'DASH', 'RSG', 'AON', 'HOOD', 'PCAR', 'TFC', 'EOG',
    'LHX', 'PSX', 'AZO', 'FTNT', 'TRV', 'ROST', 'DLR', 'APD', 'SRE', 'NXPI',
    'VLO', 'O', 'BKR', 'MPC', 'AFL', 'VST', 'MPWR', 'D', 'F', 'URI',
    'CARR', 'OKE', 'ALL', 'GWW', 'AJG', 'ZTS', 'FAST', 'AME', 'PSA', 'TGT',
    'CAH', 'MET', 'CTVA', 'IDXX', 'EA', 'BDX', 'TER', 'EXC', 'ADSK', 'DHI',
    'FANG', 'XEL', 'TRGP', 'ETR', 'CMG', 'FIX', 'OXY', 'NDAQ', 'HSY', 'KR',
    'DAL', 'YUM', 'ROK', 'DDOG', 'EW', 'CCL', 'ARES', 'WAB', 'COIN', 'SYY',
    'VMC', 'AMP', 'PEG', 'MCHP', 'AIG', 'NUE', 'CBRE', 'GRMN', 'ED', 'MLM',
    'VTR', 'ODFL', 'KDP', 'TKO', 'KEYS', 'PCG', 'CCI', 'EL', 'HIG', 'MSCI',
    'IR', 'LVS', 'WDAY', 'WEC', 'EBAY', 'PYPL', 'NRG', 'RMD', 'LYV', 'EQT',
    'GEHC', 'PRU', 'KMB', 'CPRT', 'TTWO', 'EME', 'KVUE', 'STT', 'A', 'UAL',
    'ACGL', 'HBAN', 'FITB', 'OTIS', 'MTB', 'ROP', 'AXON', 'CHTR', 'PAYX', 'DG',
    'ADM', 'IBKR', 'IRM', 'EXR', 'FISV', 'FICO', 'CTLT', 'WTW', 'DLTR', 'DOV',
    'HES', 'DD', 'IT', 'DOW', 'LEN', 'RJF', 'SW', 'FTV', 'ZBH', 'HUBB',
    'VRSK', 'ON', 'AVB', 'ANSS', 'DXCM', 'DECK', 'GIS', 'PPG', 'LH', 'BLDR',
    'CPAY', 'ALB', 'NTAP', 'SQ', 'RF', 'K', 'IOT', 'CLX', 'TROW', 'CFG',
    'ILMN', 'MKO', 'APTV', 'CDW', 'AWK', 'EG', 'FSLR', 'LPLA', 'BR', 'CAG',
    'KMX', 'XYL', 'ZM', 'SPOT', 'BALL', 'MRO', 'EQR', 'GDDY', 'VLTO', 'NTRS',
    'ALGN', 'CNP', 'WY', 'PTC', 'MAA', 'ES', 'SJM', 'CHD', 'IP', 'ESS',
    'NVR', 'IFF', 'FDS', 'PINS', 'CINF', 'DRI', 'VICI', 'ULTA', 'COO', 'ZBRA',
    'STZ', 'FE', 'INVH', 'PKG', 'LKQ', 'ERIE', 'KEY', 'WRB', 'ARW', 'SWKS',
    'EXPE', 'J', 'CMS', 'TSN', 'LII', 'BIIB', 'WRK', 'SNA', 'GEN', 'AES',
    'DFS', 'NET', 'ENPH', 'PNR', 'HRL', 'STE', 'HUBS', 'CRL', 'BBY', 'CFR',
    'MTCH', 'TYL', 'IEX', 'HOLX', 'MOH', 'JBHT', 'EVRG', 'HST', 'PAYC', 'SBAC',
    'TSCO', 'BRO', 'L', 'POOL', 'MAS', 'CNA', 'HII', 'EPAM', 'EXPD', 'TECH',
    'BAX', 'AEE', 'BEN', 'REG', 'LDOS', 'AOS', 'TXT', 'CHRW', 'PKI', 'FLT',
    'ATO', 'TDY', 'TPR', 'FMC', 'GLT', 'CPT', 'GPC', 'BMRN', 'SWK', 'NDSN',
    'LNT', 'RGA', 'PFG', 'CE', 'WDC', 'LW', 'WAT', 'JKHY', 'AMCR', 'DGX',
    'AKAM', 'AVY', 'TFX', 'BBWI', 'ALLE', 'LUV', 'TRMB', 'CZR', 'TAP', 'UDR',
    'NWSA', 'VFC', 'OMC', 'APA', 'PHM', 'CBOE', 'WBA', 'NI', 'IPG', 'WYNN',
    'MGM', 'DVN', 'AIZ', 'MOS', 'ETSY', 'HAS', 'EMN', 'UHS', 'HSIC', 'FOX',
    'AAL', 'RL', 'BF.B', 'FOXA', 'ROL', 'QRVO', 'IVZ', 'BG', 'NWSA', 'BXP',
    'PNW', 'PARA'
]);

// 기업 설명 번역 함수 (구글 번역 API 활용)
async function translateDescription(text, targetLang) {
    if (!text || targetLang === 'en') return text;

    // 번역 대상 언어 코드 매핑
    const langMap = {
        'ko': 'ko',
        'ja': 'ja'
    };

    const target = langMap[targetLang] || targetLang;

    console.log(`🌐 [${target}] 번역 중...`);

    // 구글 번역 무료 API (GTX) 활용
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const translatedText = data[0].map(item => item[0]).join('');

        return translatedText;
    } catch (error) {
        console.warn(`⚠️  번역 실패 (${target}):`, error.message);
        return text; // 실패 시 영문 유지
    }
}

// 어닝 데이터를 포스트용 JSON으로 변환
async function generateEarningsPost(earningsData, monthRange, lang, profileCache) {
    const { from, to, updateDate } = monthRange;

    // S&P 500 기업만 필터링
    const sp500Data = earningsData.filter(item => SP500_TICKERS.has(item.symbol));

    // 각 티커에 대한 회사 정보 조회
    const sp500Earnings = [];
    for (const item of sp500Data) {
        // 기업 정보 및 해당 언어 번역본 가져오기 (캐시 사용)
        const companyInfo = await getCompanyInfo(item.symbol, profileCache, lang);

        sp500Earnings.push({
            ticker: item.symbol,
            company: companyInfo.name,
            sector: companyInfo.sector, // 섹터 정보 추가
            website: companyInfo.website,
            date: item.date,
            eps_est: item.epsEstimated ? `$${item.epsEstimated.toFixed(2)}` : 'N/A',
            eps_actual: item.epsActual ? `$${item.epsActual.toFixed(2)}` : '-',
            rev_est: item.revenueEstimated ? `$${(item.revenueEstimated / 1e9).toFixed(2)}B` : 'N/A',
            rev_actual: item.revenueActual ? `$${(item.revenueActual / 1e9).toFixed(2)}B` : '-',
            description: companyInfo.description // 이미 번역된 내용
        });
    }

    // 날짜순 정렬
    sp500Earnings.sort((a, b) => new Date(a.date) - new Date(b.date));

    const titles = {
        en: `S&P 500 Earnings Calendar - UPDATE ${updateDate}`,
        ko: `S&P 500 실적 발표 캘린더 - UPDATE ${updateDate}`,
        ja: `S&P 500 決算発表カレンダー - UPDATE ${updateDate}`
    };

    const descriptions = {
        en: `Upcoming S&P 500 earnings announcements from ${from} to ${to}. Track estimated EPS and release dates. Updated ${updateDate}.`,
        ko: `${from}부터 ${to}까지 예정된 S&P 500 기업 실적 발표 일정. 예상 EPS와 발표 날짜를 확인하세요. ${updateDate} 업데이트.`,
        ja: `${from}から${to}までの予定されたS&P 500企業決算発表スケジュール。予想EPSと発表日を確認できます。${updateDate}更新。`
    };

    const overviews = {
        en: `Major S&P 500 companies will be reporting their earnings over the next 30 days. The calendar below features the latest information collected via the FMP (Financial Modeling Prep) API and is updated weekly. Review each company's estimated EPS and announcement dates before making investment decisions.`,
        ko: `S&P 500의 주요 기업들이 향후 30일 내에 실적을 발표할 예정입니다. 아래 캘린더는 FMP(Financial Modeling Prep) API를 통해 수집된 최신 정보이며, 매주 업데이트됩니다. 투자 결정에 앞서 각 기업의 예상 EPS와 발표 일정을 확인하세요.`,
        ja: `S&P 500の主요企業が今後30日以内に決算を発表する予定です。以下のカレンダーはFMP(Financial Modeling Prep) APIを通じて収集された최신情報であり、毎週更新されています。投資判断の前に各企業の予想EPSと発表日程を確認してください。`
    };

    const glossaries = {
        en: `**EPS (Earnings Per Share)**: A company's net profit divided by the number of outstanding shares. It's a key metric investors use to assess profitability.\\n\\n**Earnings Report**: An official quarterly or annual financial statement released by a company, including revenue, net income, and EPS.\\n\\n**EPS Estimate**: The average EPS forecast from analysts. If actual results beat this estimate, stock prices typically rise; if they miss, prices often fall.\\n\\n**TBA (To Be Announced)**: The announcement time hasn't yet been confirmed. Earnings are typically released before market open (BMO) or after market close (AMC).`,
        ko: `**EPS (Earnings Per Share)**: 주당순이익으로, 기업의 순이익을 발행 주식 수로 나눈 값입니다. 투자자들이 기업의 수익성을 판단하는 핵심 지표입니다.\\n\\n**실적 발표(Earnings Report)**: 기업이 분기별 또는 연간 재무 성과를 공개하는 공식 보고서입니다. 매출, 순이익, EPS 등이 포함됩니다.\\n\\n**예상 EPS(EPS Estimate)**: 애널리스트들이 예측한 평균 주당순이익입니다. 실제 발표 결과가 이 예상치를 상회하면 주가가 상승하고, 하회하면 하락하는 경향이 있습니다.\\n\\n**TBA (To Be Announced)**: 발표 시간이 아직 미정임을 의미합니다. 일반적으로 실적 발표는 장 시작 전(BMO) 또는 장 마감 후(AMC)에 이루어집니다.`,
        ja: `**EPS (Earnings Per Share / 1株当たり利益)**: 企業の純利益を発行済み株式数で割った値です。投資家が企業の収益性を判断する重要な指標です。\\n\\n**決算発表(Earnings Report)**: 企業が四半期または年間の財務結果を公開する公式報告書です。売上高、純利益、EPSなどが含まれます。\\n\\n**予想EPS(EPS Estimate)**: アナリストが予測した平均1株当たり利益です。実際の発表結果がこの予想値を上回ると株価が上昇し、下回ると下落する傾向があります。\\n\\n**TBA (To Be Announced / 未定)**: 発表時間がまだ確定していないことを意味します。一般的に決算発表は市場開始前(BMO)または市場終了後(AMC)に行われます。`
    };

    return {
        seo: {
            title: titles[lang],
            meta_description: descriptions[lang],
            slug: `sp500-earnings-calendar-${lang}`,
            category: 'Earnings',
            tags: ['Earnings', 'SP500', 'Calendar'],
            published_date: updateDate,
            author: 'Market Drip Research'
        },
        content: {
            excerpt: descriptions[lang],
            sections: [
                {
                    type: 'overview',
                    heading: lang === 'ko' ? '이번 달 실적 발표 일정' : lang === 'ja' ? '今月の決算発表スケジュール' : 'This Month\'s Earnings Schedule',
                    content: overviews[lang]
                },
                {
                    type: 'earnings_calendar',
                    heading: titles[lang],
                    earnings: sp500Earnings
                },
                {
                    type: 'company_descriptions',
                    heading: lang === 'ko' ? '주요 기업 설명' : lang === 'ja' ? '主要企業の概要' : 'Featured Company Profiles',
                    companies: sp500Earnings
                        .filter(e => {
                            const eventDate = new Date(e.date);
                            const update = new Date(updateDate);
                            const diff = (eventDate - update) / (1000 * 60 * 60 * 24);
                            // 과거 7일 ~ 미래 14일 이내 기업만 포함
                            return diff >= -7 && diff <= 14 && e.description;
                        })
                        .map(e => ({
                            name: e.company,
                            ticker: e.ticker,
                            description: e.description
                        }))
                },
                {
                    type: 'glossary',
                    heading: lang === 'ko' ? '용어 설명' : lang === 'ja' ? '用語解説' : 'Glossary',
                    content: glossaries[lang]
                }
            ]
        }
    };
}

// 메인 실행 함수
async function main() {
    console.log('📅 S&P 500 어닝 캘린더 생성 시작...\n');

    const monthRange = getMonthRange();
    console.log(`📆 수집 기간: ${monthRange.from} ~ ${monthRange.to}`);
    console.log(`📅 업데이트 날짜: ${monthRange.updateDate}\n`);

    // 1. 프로필 캐시 로드
    console.log('💾 회사 프로필 캐시 로드 중...');
    const profileCache = loadProfileCache();
    console.log(`✅ ${Object.keys(profileCache).length}개 캐시된 프로필 로드 완료\n`);

    // 2. FMP API에서 데이터 가져오기 (Windows Node.js 대역폭/응답 제한으로 인한 분할 요청)
    console.log('🔄 FMP API에서 데이터 가져오는 중 (분할 요청)...');
    let earningsData = [];
    const startDate = new Date(monthRange.from);
    const endDate = new Date(monthRange.to);

    let current = new Date(startDate);
    while (current < endDate) {
        let chunkTo = new Date(current);
        chunkTo.setDate(current.getDate() + 25); // 25일씩 끊어서 요청
        if (chunkTo > endDate) chunkTo = endDate;

        const fromStr = current.toISOString().split('T')[0];
        const toStr = chunkTo.toISOString().split('T')[0];

        console.log(`   - [${fromStr} ~ ${toStr}] 구간 요청 중...`);
        try {
            const chunk = await fetchEarningsData(fromStr, toStr);
            console.log(`     ✅ ${chunk.length}개 데이터 수신`);
            earningsData = earningsData.concat(chunk);
        } catch (err) {
            console.warn(`   ⚠️ [${fromStr} ~ ${toStr}] 구간 요청 실패:`, err.message);
        }

        // 다음 구간 시작일 설정
        current = new Date(chunkTo);
        current.setDate(current.getDate() + 1);
    }

    // 중복 제거 (날짜 경계 일치 대비)
    const uniqueMap = new Map();
    earningsData.forEach(item => {
        const key = `${item.symbol}-${item.date}`;
        uniqueMap.set(key, item);
    });
    earningsData = Array.from(uniqueMap.values());
    console.log(`✅ 필터링 전 총 ${earningsData.length}개 어닝 데이터 준비 완료\n`);

    // 3. 각 언어별 포스트 생성
    const languages = ['en', 'ko', 'ja'];
    const postsDir = path.join(__dirname, '../posts');

    for (const lang of languages) {
        const post = await generateEarningsPost(earningsData, monthRange, lang, profileCache);
        const filename = `earnings_${lang}.json`;
        const filepath = path.join(postsDir, filename);

        fs.writeFileSync(filepath, JSON.stringify(post, null, 2), 'utf-8');
        console.log(`✅ ${filename} 생성 완료 (${post.content.sections[1].earnings.length}개 기업)`);
    }

    // 4. 프로필 캐시 저장
    console.log(`\n💾 회사 프로필 캐시 저장 중...`);
    saveProfileCache(profileCache);
    console.log(`✅ ${Object.keys(profileCache).length}개 프로필 캐시 저장 완료`);

    console.log('\n🎉 어닝 캘린더 생성 완료!');
}

main().catch(error => {
    console.error('❌ 실행 중 오류 발생:', error);
    process.exit(1);
});
