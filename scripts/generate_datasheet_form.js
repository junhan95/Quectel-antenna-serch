/**
 * 데이터시트 입력 폼 생성 (CSV → Excel)
 * 
 * 카테고리별로 제품 ID와 이름을 정리하고,
 * 데이터시트 URL을 수동으로 입력할 수 있는 빈 열을 추가합니다.
 * 
 * Usage: node scripts/generate_datasheet_form.js
 * Output: datasheet_form.csv
 */

const fs = require('fs');
const path = require('path');

const antennasData = require('../src/data/antennas.json');

// 카테고리별로 분류
const categories = {};
antennasData.forEach(a => {
    const cat = a.category || 'Unknown';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({
        id: a.id,
        name: a.name || a.id,
        description: (a.description || '').replace(/"/g, '""').substring(0, 100)
    });
});

// CSV BOM (Excel에서 한글 깨짐 방지)
let csv = '\uFEFF';

// 헤더
csv += '"카테고리","No","제품 ID","제품명","설명","데이터시트 URL"\n';

// 카테고리 순서 정의
const categoryOrder = ['Embedded antennas', 'External antennas', 'Cables', 'Evaluation Boards'];

let globalNo = 1;

for (const cat of categoryOrder) {
    const products = categories[cat];
    if (!products) continue;

    // 카테고리별 ID 정렬
    products.sort((a, b) => a.id.localeCompare(b.id));

    for (const product of products) {
        csv += `"${cat}","${globalNo}","${product.id}","${product.name}","${product.description}",""\n`;
        globalNo++;
    }
}

// 파일 저장
const outputPath = path.join(__dirname, '..', 'datasheet_form.csv');
fs.writeFileSync(outputPath, csv, 'utf-8');

console.log(`\n✅ 데이터시트 입력 폼 생성 완료!`);
console.log(`   파일: ${outputPath}`);
console.log(`   총 제품 수: ${globalNo - 1}개`);
console.log(`\n   카테고리별:`);
for (const cat of categoryOrder) {
    if (categories[cat]) {
        console.log(`   - ${cat}: ${categories[cat].length}개`);
    }
}
console.log(`\n📝 사용법:`);
console.log(`   1. CSV 파일을 Excel로 열기`);
console.log(`   2. "데이터시트 URL" 열에 각 제품의 데이터시트 링크 입력`);
console.log(`   3. 완성된 파일을 전달해주세요\n`);
