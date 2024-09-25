const jsonInput = `{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "43",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}`;

try {
    mainFunction(jsonInput);
} catch (e) {
    console.error("Error: " + e.message);
}

function mainFunction(jsonInput) {
    const parsedJson = JSON.parse(jsonInput);
    const n = parsedJson.keys.n;
    const k = parsedJson.keys.k;

    if (n < k) {
        throw new Error(`Provided roots (n=${n}) are less than required (k=${k}).`);
    }

    const roots = [];
    const xValues = [];

    for (let i = 1; i <= n; i++) {
        if (parsedJson[i]) {
            const base = parseInt(parsedJson[i].base);
            const value = parsedJson[i].value;
            const x = i; // The key is x
            const y = convertToDecimal(value, base); // Decode y value

            xValues.push(x);
            roots.push(y);
        }
    }

    const constantTerm = calculateConstantTerm(xValues.slice(0, k), roots.slice(0, k));
    console.log("The constant term (c) of the polynomial is: " + constantTerm);
}

function convertToDecimal(value, base) {
    if (base <= 36) {
        return parseInt(value, base);
    } else {
        return customBaseToDecimal(value, base);
    }
}

function customBaseToDecimal(value, base) {
    let result = 0;
    const digits = value.split('');

    for (const digit of digits) {
        let digitValue;
        if (digit >= '0' && digit <= '9') {
            digitValue = digit.charCodeAt(0) - '0'.charCodeAt(0); // 0-9
        } else if (digit >= 'A' && digit <= 'Z') {
            digitValue = digit.charCodeAt(0) - 'A'.charCodeAt(0) + 10; // A-Z mapped to 10-35
        } else if (digit >= 'a' && digit <= 'z') {
            digitValue = digit.charCodeAt(0) - 'a'.charCodeAt(0) + 36; // a-z mapped to 36-61
        } else {
            throw new Error("Invalid character in input: " + digit);
        }

        if (digitValue >= base) {
            throw new Error(`Digit ${digit} is not valid for base ${base}`);
        }

        result = result * base + digitValue;
    }

    return result;
}

function calculateConstantTerm(xValues, roots) {
    let constantTerm = 0;
    const k = roots.length;

    for (let i = 0; i < k; i++) {
        let li = 1; // Lagrange basis polynomial L_i(0)
        console.log(`Calculating L_${i}(0)`);
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const term = (0 - xValues[j]) / (xValues[i] - xValues[j]);
                li *= term; // Update L_i(0)
                console.log(`j: ${j}, term: ${term}, li: ${li}`);
            }
        }
        const contribution = roots[i] * li; // Contribution to the constant term
        constantTerm += contribution; // Update total constant term
        console.log(`L_${i}(0): ${li}, contribution to constant term: ${contribution}`);
       
    }

    return Math.round(constantTerm); // Round to avoid floating-point issues
}


