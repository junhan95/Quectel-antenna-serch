/**
 * 반자동 DigiKey 규격서(Datasheet) Scraper
 * 
 * 🎯 사용 방법:
 * 1. 스크립트 실행: node scripts/scrape_datasheets.js
 * 2. Chrome 브라우저가 열리면 DigiKey 사이트에서 "길게 누르기" 봇 인증을 통과해주세요
 * 3. 인증 통과 후 스크립트가 자동으로 모든 제품의 규격서를 수집합니다
 * 4. 중간에 다시 봇 차단이 걸리면 콘솔에 안내가 표시됩니다 - 다시 인증해주세요
 * 
 * ⏸ 중단 후 이어서 실행 가능 (이미 수집된 결과는 건너뜀)
 * 
 * Output: src/data/datasheetLinks.js
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const antennasData = require('../src/data/antennas.json');
const allProductIds = antennasData.map(a => a.id);

const outputPath = path.join(__dirname, '..', 'src', 'data', 'datasheetLinks.js');

// 사용자 입력 대기 함수
function waitForUserInput(prompt) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * 봇 차단 체크 및 사용자에게 수동 해결 요청
 */
async function handleBotBlock(page) {
    const isBlocked = await page.evaluate(() => {
        const text = document.body.innerText || '';
        return text.includes('big fans of Robots') || text.includes('길게 누르기') ||
            text.includes('verify you are') || text.includes('확인해');
    });

    if (isBlocked) {
        console.log(`\n   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`   ⛔ DigiKey 봇 차단 감지!`);
        console.log(`   👉 열린 브라우저에서 "길게 누르기" 인증을 완료해주세요`);
        console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        await waitForUserInput('   ✅ 인증 완료 후 Enter를 눌러주세요... ');

        // 인증 후 잠시 대기
        await new Promise(r => setTimeout(r, 2000));
        return true;
    }
    return false;
}

/**
 * DigiKey 검색으로 규격서 URL 추출
 */
async function scrapeDatasheet(page, productId) {
    try {
        // DigiKey 검색
        const searchUrl = `https://www.digikey.kr/ko/products/result?keywords=${encodeURIComponent(productId)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(r => setTimeout(r, 5000));

        // 봇 차단 체크
        const wasBlocked = await handleBotBlock(page);
        if (wasBlocked) {
            // 인증 후 다시 검색 페이지로 이동
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 5000));
        }

        const currentUrl = page.url();

        // 제품 상세 페이지로 자동 이동됐는지 확인
        if (!currentUrl.includes('/products/detail/')) {
            // 검색 결과 페이지에서 제품 링크 클릭
            const productLink = await page.evaluate((pid) => {
                const links = Array.from(document.querySelectorAll('a'));
                for (const link of links) {
                    const href = link.getAttribute('href') || '';
                    const text = link.textContent || '';
                    if (href.includes('/products/detail/') &&
                        (text.toUpperCase().includes(pid) || href.toUpperCase().includes(pid.toUpperCase()))) {
                        return href.startsWith('http') ? href : 'https://www.digikey.kr' + href;
                    }
                }
                return null;
            }, productId);

            if (!productLink) {
                return null;
            }

            await page.goto(productLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 5000));

            // 제품 상세 페이지에서도 봇 차단 체크
            await handleBotBlock(page);
        }

        // 규격서 링크 추출
        const datasheetUrl = await page.evaluate(() => {
            const allLinks = Array.from(document.querySelectorAll('a'));

            // 1순위: "규격서" 텍스트
            for (const link of allLinks) {
                const text = (link.textContent || '').trim();
                const href = link.getAttribute('href') || '';
                if (text.includes('규격서') && href.length > 5 && !href.startsWith('javascript')) {
                    let url = href;
                    if (url.startsWith('//')) url = 'https:' + url;
                    return url;
                }
            }

            // 2순위: quectel Datasheet PDF
            for (const link of allLinks) {
                const href = link.getAttribute('href') || '';
                if (href.includes('quectel.com') && href.includes('.pdf') &&
                    href.toLowerCase().includes('datasheet')) {
                    return href.startsWith('//') ? 'https:' + href : href;
                }
            }

            // 3순위: Datasheet 텍스트가 있는 PDF 링크
            for (const link of allLinks) {
                const text = (link.textContent || '').toLowerCase().trim();
                const href = link.getAttribute('href') || '';
                if (text.includes('datasheet') && href.includes('.pdf')) {
                    return href.startsWith('//') ? 'https:' + href : href;
                }
            }

            return null;
        });

        return datasheetUrl;

    } catch (error) {
        console.log(`   ⚠️ Error: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log(`\n╔════════════════════════════════════════════════╗`);
    console.log(`║  DigiKey 규격서 수집기 (반자동 모드)           ║`);
    console.log(`║  총 제품: ${String(allProductIds.length).padEnd(4)}개                            ║`);
    console.log(`╚════════════════════════════════════════════════╝\n`);

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080',
            '--start-maximized'
        ],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const results = {};

    // 기존 결과 불러오기
    if (fs.existsSync(outputPath)) {
        try {
            const content = fs.readFileSync(outputPath, 'utf-8');
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                Object.assign(results, eval('(' + match[0] + ')'));
                console.log(`📂 기존 결과 ${Object.keys(results).length}개 불러옴\n`);
            }
        } catch (e) { }
    }

    // Step 1: 먼저 DigiKey에 접속해서 봇 인증 통과
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📌 먼저 DigiKey에 접속합니다.`);
    console.log(`   봇 인증("길게 누르기")이 표시되면 통과해주세요.`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    await page.goto('https://www.digikey.kr/ko', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    await handleBotBlock(page);

    await waitForUserInput('\n✅ DigiKey 메인 페이지가 정상적으로 보이면 Enter를 눌러 수집을 시작합니다... ');

    let found = Object.keys(results).length;
    let notFound = 0;
    const notFoundList = [];
    const startTime = Date.now();

    for (let i = 0; i < allProductIds.length; i++) {
        const productId = allProductIds[i];

        if (results[productId]) {
            continue;
        }

        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
        console.log(`\n[${i + 1}/${allProductIds.length}] ${productId} (경과: ${elapsed}분, 수집: ${found}개)`);

        const datasheetUrl = await scrapeDatasheet(page, productId);

        if (datasheetUrl) {
            results[productId] = datasheetUrl;
            found++;
            console.log(`   ✅ ${datasheetUrl}`);
        } else {
            notFound++;
            notFoundList.push(productId);
            console.log(`   ❌ 미발견`);
        }

        // 주기적 저장
        if (found % 5 === 0 && found > 0) {
            saveResults(results);
        }

        // Rate limiting (3~5초)
        await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }

    // 최종 저장
    saveResults(results);

    if (notFoundList.length > 0) {
        const notFoundPath = path.join(__dirname, '..', 'src', 'data', 'datasheets_not_found.txt');
        fs.writeFileSync(notFoundPath, notFoundList.join('\n'), 'utf-8');
    }

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`\n\n╔════════════════════════════════════╗`);
    console.log(`║  수집 완료!                        ║`);
    console.log(`║  수집: ${String(found).padEnd(4)}개                     ║`);
    console.log(`║  미발견: ${String(notFound).padEnd(4)}개                   ║`);
    console.log(`║  소요 시간: ${totalTime.padEnd(6)}분               ║`);
    console.log(`╚════════════════════════════════════╝\n`);

    await browser.close();
}

function saveResults(results) {
    const entries = Object.entries(results)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, url]) => `  "${id}": "${url}"`)
        .join(',\n');

    const content = `// DigiKey에서 추출한 데이터시트 링크
// 생성 시간: ${new Date().toISOString()}
// 총 제품 수: ${Object.keys(results).length}

const datasheetLinks = {
${entries}
};

export default datasheetLinks;
`;

    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`   💾 저장 완료 (${Object.keys(results).length}개)`);
}

main().catch(console.error);
