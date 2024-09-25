const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points) {
    let n = points.length;
    let c = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0]; 
        let yi = points[i][1]; 
        let product = yi;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let xj = points[j][0];
                product *= (0 - xj) / (xi - xj); 
            }
        }
        c += product; 
    }
    return c;
}

function solveSecretFromJSON() {
    let input;

    try {
        const data = fs.readFileSync('./input.json', 'utf8');
        console.log("Data read from file:", data); // Log the data
        input = JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the input file:", error);
        return; // Exit the function if there is an error
    }
    
    const n = input.keys.n;
    const k = input.keys.k;

    const points = [];

    for (let i = 1; i <= n; i++) {
        const x = i; 
        const base = parseInt(input[i].base); 
        const y = decodeValue(base, input[i].value);
        points.push([x, y]);
    }

    const constantTerm = lagrangeInterpolation(points.slice(0, k));

    console.log('The constant term c is:', constantTerm);
}

solveSecretFromJSON();
