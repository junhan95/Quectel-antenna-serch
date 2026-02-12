/**
 * Quick test: DigiKey 규격서 링크 추출 테스트
 * 사용자가 제공한 URL 패턴으로 직접 접속 테스트
 */
const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--window-size=1920,1080'],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 사용자가 제공한 정확한 URL로 테스트
    const testUrl = 'https://www.digikey.kr/ko/products/detail/quectel/YPCS001AA/21272681';
    console.log(`\n테스트: ${testUrl}\n`);

    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 페이지 로딩 대기 (JS rendering)
    console.log('페이지 로딩 대기 중 (10초)...');
    await new Promise(r => setTimeout(r, 10000));

    // "규격서" 텍스트가 있는 모든 요소 찾기
    const results = await page.evaluate(() => {
        const body = document.body.innerHTML;

        // "규격서" 문자열이 페이지에 있는지 확인
        const hasText = body.includes('규격서');

        // 모든 링크에서 규격서 관련 링크 찾기
        const allLinks = Array.from(document.querySelectorAll('a'));
        const relevantLinks = [];

        for (const link of allLinks) {
            const href = link.getAttribute('href') || '';
            const text = link.textContent.trim();
            const parentText = link.parentElement ? link.parentElement.textContent.trim().substring(0, 100) : '';

            if (text.includes('규격서') || text.includes('Datasheet') || text.includes('datasheet') ||
                href.includes('.pdf') || href.includes('datasheet')) {
                relevantLinks.push({ href, text: text.substring(0, 80), parentText: parentText.substring(0, 100) });
            }
        }

        // 추가: data 속성이나 특별한 속성을 가진 요소 찾기
        const pdfElements = Array.from(document.querySelectorAll('[href*=".pdf"], [data-url*=".pdf"], [src*=".pdf"]'));
        const pdfAttrs = pdfElements.map(el => ({
            tag: el.tagName,
            href: el.getAttribute('href'),
            dataUrl: el.getAttribute('data-url'),
            text: el.textContent.trim().substring(0, 80)
        }));

        return { hasText, relevantLinks, pdfAttrs, totalLinks: allLinks.length };
    });

    console.log(`\n"규격서" 텍스트 존재: ${results.hasText}`);
    console.log(`총 링크 수: ${results.totalLinks}`);
    console.log(`\n관련 링크:`);
    console.log(JSON.stringify(results.relevantLinks, null, 2));
    console.log(`\nPDF 관련 요소:`);
    console.log(JSON.stringify(results.pdfAttrs, null, 2));

    // 스크린샷 저장
    await page.screenshot({ path: 'debug_digikey_page.png', fullPage: false });
    console.log('\n스크린샷 저장: debug_digikey_page.png');

    await browser.close();
}

main().catch(console.error);
