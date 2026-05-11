const fs = require('fs');

const appFile = 'games/islem-zinciri/app.js';
let appCode = fs.readFileSync(appFile, 'utf8');

const levelsCode = fs.readFileSync('generated_levels_islem.js', 'utf8');

// The levels code starts with `const levels = [...];`
// we will replace the existing `const levels = [\n...\n];` in app.js

const regex = /const levels = \[[\s\S]*?\];/;
appCode = appCode.replace(regex, levelsCode.trim());

fs.writeFileSync(appFile, appCode);
console.log('Successfully injected levels into app.js');
