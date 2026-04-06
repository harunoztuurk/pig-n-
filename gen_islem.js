const fs = require('fs');

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevels(count) {
    const operators = ['+', '-', '*'];
    // to avoid decimals without division logic checking, we skip division or ensure clean division. 
    // To keep it simple, let's use +, -, * mostly.
    
    let generated = [];
    
    for (let i = 1; i <= count; i++) {
        let numSlots = 2; // base
        if (i > 10) numSlots = 3;
        if (i > 30) numSlots = 4;
        if (i > 45) numSlots = 5;
        
        // generate a valid expression
        let exprNumbers = [];
        let exprOps = [];
        
        let target = null;
        let valid = false;
        let numbersPool = [];
        let slots = [];
        
        while(!valid) {
            exprNumbers = [];
            exprOps = [];
            slots = [];
            let expressionString = '';
            for (let j = 0; j < numSlots; j++) {
                let maxNum = j === 0 || j === 1 ? 10 : 20;
                if (i > 20) maxNum = 20;
                if (i > 35) maxNum = 30;
                
                let n = randomInt(1, maxNum);
                exprNumbers.push(n);
                slots.push('n');
                expressionString += n;
                
                if (j < numSlots - 1) {
                    let minOp = (i > 15) ? 0 : 0; // limit ops logic if needed
                    let op = operators[randomInt(0, operators.length - 1)];
                    exprOps.push(op);
                    slots.push('o');
                    expressionString += op;
                }
            }
            
            try {
                target = Function('"use strict";return (' + expressionString + ')')();
                
                if (Number.isInteger(target) && target > 0 && target <= 500) {
                    valid = true;
                }
            } catch (e) {
                valid = false;
            }
        }
        
        // Let's add 1 or 2 extra random numbers to the pool
        let extraCount = i > 5 ? 1 : 0;
        if (i > 25) extraCount = 2;
        
        numbersPool = [...exprNumbers];
        for(let k=0; k<extraCount; k++) {
            numbersPool.push(randomInt(1, 20));
        }
        
        // Shuffle numbers pool
        numbersPool.sort(() => Math.random() - 0.5);
        
        generated.push({
            target: target,
            numbers: numbersPool,
            slots: slots
        });
    }
    
    return generated;
}

const levels = generateLevels(50);
const levelsStr = "const levels = " + JSON.stringify(levels, null, 4) + ";";

console.log(levelsStr);
fs.writeFileSync('generated_levels_islem.js', levelsStr);
