const fs = require('fs');
const html = fs.readFileSync('G:/VIETTEL TAMMI/CĐBR+DĐ_PYC Link phan kenh/Viettel_Portal_LPK/index.html', 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    fs.writeFileSync(`test_script_${count}.js`, code);
    console.log(`Extracted script ${count}`);
    count++;
}
