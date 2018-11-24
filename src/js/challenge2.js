import { METRIC_UNITS, IMPERIAL_UNITS, calculateResult } from './challenge2-func';

//TODO: get values from html, css, DOM:
// Units to be converted, read from the website:
let unitGiven = "mm";
let unitResult = "mile";

// Unit value to be converted, read from the input:
let valueInput = 126; 

//TODO: formatResult w zależności od całkowitej ilości cyfr, może jednostek, ilości 0 itp.

/* TODO: (remove) TEST CODE:
console.log(isMetric(unitGiven));
console.log(isImperial(unitResult));
console.log(getFactor(unitGiven));
console.log(getFactor(unitResult));
console.log(getFactor("unitResult"));
console.log(parseNumber(3.3));
console.log(parseNumber(4));
console.log(parseNumber("5"));
console.log(parseNumber("6dsji"));
console.log(parseNumber("fs7"));
console.log(parseNumber("fds8fds"));
console.log(parseNumber("  9"));
console.log(parseNumber("  10   "));
console.log(parseNumber("  "));
console.log(parseNumber(""));
console.log(parseNumber(null));
console.log(parseNumber(undefined));
console.log(parseNumber(NaN));
console.log(parseNumber('NaN'));
console.log(parseNumber(Number.NaN)); */
console.log(calculateResult(valueInput, unitGiven, unitResult));
console.log(calculateResult(4, "mile", "km"));