const fs = require('fs');

const levels = [];

// Helper functions
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ensure the pool has the solution items, plus some distracting items
function buildLevel(task, targetVal, targetDisplay, solutionPool, distractorPool) {
    const pool = [...solutionPool, ...distractorPool];
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return {
        task,
        targetVal,
        targetDisplay,
        pool
    };
}

// 1-10: Easy Integers & Halves
for (let i = 1; i <= 10; i++) {
    const target = (Math.random() < 0.5) ? randomInt(1, 5) : randomInt(1, 4) + 0.5;
    const task = `Sol kefedeki ${target} birimini dengele`;
    
    let solution = [];
    let current = 0;
    while (current < target) {
        let diff = target - current;
        if (diff >= 1) {
            let choice = (Math.random() < 0.5) ? 1 : 0.5;
            solution.push(choice === 1 ? {display: "1", val: 1.0, type: 'decimal'} : {display: "0.5", val: 0.5, type: 'decimal'});
            current += choice;
        } else if (diff === 0.5) {
            solution.push({display: "0.5", val: 0.5, type: 'decimal'});
            current += 0.5;
        }
    }
    
    let distractors = [
        {display: "1", val: 1.0, type: 'decimal'},
        {display: "0.5", val: 0.5, type: 'decimal'}
    ];
    if (Math.random() < 0.5) distractors.push({display: "1/2", val: 0.5, type: 'fraction'});

    levels.push(buildLevel(task, target, target.toString(), solution, distractors));
}

// 11-20: Fractions and Decimals basics
for (let i = 1; i <= 10; i++) {
    const fractionTypes = [
        { d: "3/4", v: 0.75, t: "Sol kefede 3/4 bulunuyor, dengeyi sağla" },
        { d: "1.25", v: 1.25, t: "Sol kefedeki 1.25 birimi dengele" },
        { d: "1/4", v: 0.25, t: "Sol kefede çeyrek (1/4) bulunuyor, dengele" },
        { d: "0.75", v: 0.75, t: "Sol kefedeki 0.75 birimi dengele" },
        { d: "1.5", v: 1.5, t: "Sol kefedeki 1.5 birimi dengele" },
    ];
    const picked = randomElement(fractionTypes);
    
    let solution = [];
    let current = 0;
    const items = [
        {display: "1/2", val: 0.5, type: 'fraction'},
        {display: "1/4", val: 0.25, type: 'fraction'},
        {display: "0.25", val: 0.25, type: 'decimal'},
        {display: "0.5", val: 0.5, type: 'decimal'},
        {display: "1", val: 1.0, type: 'decimal'}
    ];
    
    // Create random subset that sums up to picked.v
    // just a simple greedy approach for 0.25 multiples
    let remaining = picked.v;
    while(remaining > 0.001) {
        let validItems = items.filter(it => it.val <= remaining + 0.001);
        if(validItems.length === 0) break;
        let chosenItem = randomElement(validItems);
        solution.push(chosenItem);
        remaining -= chosenItem.val;
    }
    
    let distractors = [
        randomElement(items),
        randomElement(items),
        {display: "0.1", val: 0.1, type: 'decimal'}
    ];

    levels.push(buildLevel(picked.t, picked.v, picked.d, solution, distractors));
}

// 21-30: Constants and mix
for (let i = 1; i <= 10; i++) {
    const types = [
        { d: "π ≈ 3.14", v: 3.14, t: "Pi'nin yaklaşımı olan ~3.14'ü oluştur" },
        { d: "e ≈ 2.71", v: 2.71, t: "Euler sayısı olan ~2.71'i oluştur" },
        { d: "Altın Oran ≈ 1.61", v: 1.61, t: "Altın Oran yaklaşımı ~1.61'i oluştur" },
        { d: "2.5", v: 2.5, t: "2.5 toplamını bul!" },
        { d: "9/4", v: 2.25, t: "Sol kefede 9/4 bulunuyor, dengeyi sağla" }
    ];
    const picked = randomElement(types);
    
    let solution = [];
    let remaining = picked.v;
    
    const possibleItems = [
        {display: "1", val: 1.0, type: 'decimal'},
        {display: "0.5", val: 0.5, type: 'decimal'},
        {display: "0.1", val: 0.1, type: 'decimal'},
        {display: "0.01", val: 0.01, type: 'decimal'},
        {display: "0.25", val: 0.25, type: 'decimal'},
        {display: "1/2", val: 0.5, type: 'fraction'},
        {display: "1/4", val: 0.25, type: 'fraction'}
    ];
    
    while(remaining > 0.001) {
        let validItems = possibleItems.filter(it => it.val <= remaining + 0.001);
        // Force greedy for large chunks to avoid too many items
        if (remaining >= 1) {
            let item = {display: "1", val: 1.0, type: 'decimal'};
            solution.push(item);
            remaining -= 1.0;
        }
        else if(validItems.length > 0) {
            // Sort by val descending to prefer larger chunks
            validItems.sort((a,b) => b.val - a.val);
            let chosenItem = validItems[0];
            solution.push(chosenItem);
            remaining -= chosenItem.val;
        } else {
            break;
        }
    }
    
    let distractors = [
        {display: "0.1", val: 0.1, type: 'decimal'},
        {display: "0.5", val: 0.5, type: 'decimal'},
        {display: "1/4", val: 0.25, type: 'fraction'}
    ];

    levels.push(buildLevel(picked.t, picked.v, picked.d, solution, distractors));
}

// 31-50: Advanced Fractions, Decimals, Precision (1/8, 0.125, etc.)
for (let i = 1; i <= 20; i++) {
    const advTypes = [
        { d: "3/8", v: 0.375, t: "Sol kefede 3/8 bulunuyor, dengeyi sağla" },
        { d: "5/8", v: 0.625, t: "Sol kefede 5/8 var" },
        { d: "1.125", v: 1.125, t: "Sol kefedeki 1.125 birimi dengele" },
        { d: "√2 ≈ 1.41", v: 1.41, t: "Kök 2 yaklaşık değeri: 1.41'i oluştur" },
        { d: "√3 ≈ 1.73", v: 1.73, t: "Kök 3 yaklaşık değeri: 1.73'ü oluştur" },
        { d: "2.375", v: 2.375, t: "Sol kefedeki 2.375 birimi dengele" },
        { d: "7/8", v: 0.875, t: "Sol kefede 7/8 bulunuyor, dengele" },
        { d: "4.2", v: 4.2, t: "Sol kefedeki 4.2 birimi dengele" }
    ];
    const picked = randomElement(advTypes);
    
    let solution = [];
    let remaining = picked.v;
    
    // Custom set of possible items
    const advItems = [
        {display: "1", val: 1.0, type: 'decimal'},
        {display: "0.5", val: 0.5, type: 'decimal'},
        {display: "0.25", val: 0.25, type: 'decimal'},
        {display: "0.1", val: 0.1, type: 'decimal'},
        {display: "0.01", val: 0.01, type: 'decimal'},
        {display: "1/8", val: 0.125, type: 'fraction'},
        {display: "0.125", val: 0.125, type: 'decimal'}
    ];
    
    while(remaining > 0.0001) {
        let validItems = advItems.filter(it => it.val <= remaining + 0.0001);
        if(validItems.length > 0) {
            validItems.sort((a,b) => b.val - a.val);
            let chosenItem = validItems[0];
            
            // Randomize slightly if possible to mix types
            let possibleChoices = validItems.filter(it => it.val === chosenItem.val);
            if (Math.random() < 0.5 && possibleChoices.length > 1) {
                chosenItem = possibleChoices[1];
            }
            // For tiny remaining like 0.01 occasionally to prevent infinite loops due to float math
            solution.push(chosenItem);
            remaining -= chosenItem.val;
        } else {
            break;
        }
    }
    
    let distractors = [
        randomElement(advItems),
        randomElement(advItems),
        randomElement(advItems)
    ];

    levels.push(buildLevel(picked.t, picked.v, picked.d, solution, distractors));
}

// Convert to formatted string
let outputCode = "// Levels with target side (left) and available pieces (right pool)\nconst levels = " + JSON.stringify(levels, null, 4) + ";\n";
const appJsPath = "c:/Users/harun/Desktop/pig-n--main/games/denge-terazisi/app.js";

let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// The existing levels array goes from line 7 to line 44 roughly.
// We can use regex to replace it.
const regex = /\/\/ Levels with target side \(left\) and available pieces \(right pool\)[\s\S]*?\];/;
const newAppJsContent = appJsContent.replace(regex, outputCode);

fs.writeFileSync(appJsPath, newAppJsContent, 'utf8');
console.log("Successfully appended 50 levels");
