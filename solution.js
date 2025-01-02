const fs = require('fs');

function decodeValue(value, base) {
    return parseInt(value, parseInt(base));
}

function lagrangeInterpolation(points) {
    const x = 0;
    let result = 0;
    
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term = term * (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }
    
    return Math.round(result); 
}

function findSecret(testCase) {
    const n = testCase.keys.n;  
    const k = testCase.keys.k;  
    
    let points = [];
    let count = 0;
    
    const keys = Object.keys(testCase)
        .filter(key => key !== 'keys')
        .map(Number)
        .sort((a, b) => a - b);
    
    for (let key of keys) {
        if (count >= k) break;
        
        const point = testCase[key];
        const x = key;
        const y = decodeValue(point.value, point.base);
        
        points.push({ x, y });
        count++;
    }
    
    return lagrangeInterpolation(points);
}

function processTestCasesFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const testCases = JSON.parse(data);
        
        Object.keys(testCases).forEach(testCaseKey => {
            const testCase = testCases[testCaseKey];
            const secret = findSecret(testCase);
            console.log(`Secret for test case ${testCaseKey}: ${secret}`);
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: File not found');
        } else if (error instanceof SyntaxError) {
            console.error('Error: Invalid JSON format in file');
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

const filename = process.argv[2];
if (!filename) {
    console.error('Please provide a JSON file path as argument');
    console.error('Usage: node script.js <path-to-json-file>');
    process.exit(1);
}

processTestCasesFromFile(filename);