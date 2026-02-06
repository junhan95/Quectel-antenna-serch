const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('brochure.pdf');

pdf(dataBuffer).then(function (data) {
    // PDF text
    console.log(data.text);
    fs.writeFileSync('raw_text.txt', data.text);
}).catch(function (error) {
    console.error(error);
    fs.writeFileSync('error.log', error.stack || String(error));
});
