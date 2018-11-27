/** --Length Units--
 * Metric units system, units names and their relations to 
 * basic length unit: meter.
 * 
 * @constant METRIC_UNITS - metric units
*/
const METRIC_UNITS = {
  mm: [1/1000, "mm", "milimetr"],
  cm: [1/100, "cm", "centymetr"],
  dm: [1/10, "dm", "decymetr"],
  m: [1, "m", "metr"],
  km: [1000, "km", "kilometr"]
}

/** --Length Units--
 * Imperial units system, units names and their relations to 
 * basic length unit: foot.
 * 
 * @constant IMPERIAL_UNITS - imperial units
*/
const IMPERIAL_UNITS = {
  inch: [1 / 12, "in", "cal"],
  link: [66/100, "link", "link"],
  foot: [1, "ft", "stopa"],
  yard: [3, "yd", "jard"],
  rod: [66/4, "rod", "pręt"],
  chain: [66, "ch", "łańcuch"],
  furlong: [660, "fur", "furlong"],
  mile: [5280, "mi", "mila"],
  league: [15840, "lea", "liga"]
}

/** Defined by the International yard and pound agreement of 1959:
 * 1yd = 0.9144m. Also foot = 1/3 yard, so: 1ft = 0.3048m
 * YARD_TO_METER_RATIO = 0.9144
 * 
 * @constant FOOT_TO_METER_RATIO - ft/m ratio
 */
const FOOT_TO_METER_RATIO = 0.3048;

/**
 * Constant relates to maximum number of decimal places of result 
 * after calculations.
 * 
 * @constant DECIMAL_PRECISION_MAX  - number of decimal places for result
 */
const DECIMAL_PRECISION_MAX = 9;

/** Helper method to check whether given unit is part of metric system - 
 * cross-checked with keys in *_UNITS type object.
 * 
 * @param {string} unit - unit to be checked
 * @returns {boolean} is unit in metric system
 */
const isMetric = unit => METRIC_UNITS.hasOwnProperty(unit)

/** Helper method to check whether given unit is part of imperial system - 
 * cross-checked with keys in *_UNITS type object.
 * 
 * @param {string} unit - unit to be checked
 * @returns {boolean} is unit in imperial system
 */
const isImperial = unit => IMPERIAL_UNITS.hasOwnProperty(unit)


/** Get factor from the same unit system, indicating ratio 
 * between basic unit and given unit 
 * (e.g. "yard" returns 3, because 1yd = 3ft). 
 * 
 * @param {string} unit - unit name
 * 
 * @returns {number|null} givenUnit to basicUnit ratio
 * 
 * @throws Will throw an error if unit is not in *_UNITS objects.
 */
const getFactor = unit => {
  // Possible units can be only the ones in *_UNITS objects:
  try {
    if (isMetric(unit)) {
      return METRIC_UNITS[unit][0];
    } else if (isImperial(unit)) {
      return IMPERIAL_UNITS[unit][0];
    } else {
      throw new Error(`Tried convert "${unit}". This is not a valid unit.`);
    }
  } catch(e) {
    console.log(e.name + ': ' + e.message);
    return null;
  }
}

/**
 * Check whether given number's or result's precision is not out of range.
 * Will throw an Error if out of possible precision - 15 decimal digits.
 * 
 * @param {number} num - value passed for calculations
 * @param {number} unitFactor - digits added by unit conversion
 * @param {number} decimalPrecision - required precision
 * 
 * @throws {Error} Error with "NumberLengthError" message
 */
const checkPrecision = (num, unitFactor, decimalPrecision) => {
  const numArray = num.toString().split('.');
  const unitFactorArray = unitFactor.toString().split('.');
  const resultArray = (num * unitFactor).toString().split('.');

  // Evaluate decimal precision necessary:
  if (numArray.length > 1 && unitFactorArray.length > 1) {
    decimalPrecision = Math.min(decimalPrecision, numArray[1].length +
      unitFactorArray[1].length);
  } else if (numArray.length > 1) {
    decimalPrecision = Math.min(decimalPrecision, numArray[1].length);
  } else if (unitFactorArray.length > 1) {
    decimalPrecision = Math.min(decimalPrecision, unitFactorArray[1].length);
    // Same unit, so should be 1.00(0), no decimals:
    if (unitFactorArray[0] === 1 && unitFactorArray[1].toFixed(2) === 0) {
      decimalPrecision = 0;
    }
  } else {
    decimalPrecision = 0;
  }

  if (resultArray[0].length + decimalPrecision > 15) {
    throw new Error("NumberLengthError");
  }
}

/** Check if given value is a number and return its value.
 * 
 * @param {string|number} num - value to be parsed
 * 
 * @returns {number|null} result of parsing
 */
const parseNumber = num => {
  if (typeof num === 'number' && !Number.isNaN(num)) return num;
  if (typeof num === 'string') {
    const numTrimmed = num.trim();
    if (numTrimmed) {
      const numUseDots = numTrimmed.split(',').join('.');
      const parsedNum = Number(numUseDots);
      if (!Number.isNaN(parsedNum)) return parsedNum;
    }
  }
  return null;
}

/** 
 * Calculate the result of conversion of value input, with specified 
 * starting unit and desirable unit 
 * 
 * @param {string|number} valueInput - value input to be converted
 * @param {string} unitGiven - unit name for given value input
 * @param {string} unitResult - unit name for output value (result)
 * 
 * @returns {number} value after conversion
 * 
 * @throws {Error} Will throw an Error if calculation numbers are 
 * out of possible precision - 15 decimal digits
 */
const calculateResult = (valueInput, unitGiven,
  unitResult, decimalPrecision) => {
  // Get factor in relation to the basic unit:
  const unitGivenFactor = getFactor(unitGiven);
  const unitResultFactor = getFactor(unitResult);
  if (unitGivenFactor === null || unitResultFactor === null) return null;

  const parsedValue = parseNumber(valueInput);
  if (parsedValue === null || parsedValue < 0) return null; 

  // If units are in different systems, get ratio:
  let systemFactor = 1;
  if (isMetric(unitGiven) && isImperial(unitResult)) {
    systemFactor = 1 / FOOT_TO_METER_RATIO;
  } else if (isImperial(unitGiven) && isMetric(unitResult)) {
    systemFactor = FOOT_TO_METER_RATIO;
  }

  if (decimalPrecision === undefined) {
    decimalPrecision = DECIMAL_PRECISION_MAX ;
  } 

  // Check if given number is not too long:
  try {
    const unitFactor = unitGivenFactor * systemFactor / unitResultFactor;
    checkPrecision(parsedValue, unitFactor, decimalPrecision);
  } catch (e) {
    throw e;
  }

  // For number rounding:
  const precisionFactor = Math.pow(10, decimalPrecision);

  // Result, e.g.: miles to km: 4[mi] = 4*5280[ft] = 4*5280*(ratio=0.3048)[m] =
  // = 4 * 5280 * 0.3048 / (1000)[km] = 6.437km
  let result = (Math.round((parsedValue * unitGivenFactor *
    systemFactor / unitResultFactor) * precisionFactor)) / precisionFactor;
  // Remove last digit that might influence result:
  if ((result + '').replace('.', '').length > 15) {
    result = parseFloat(result.toString().slice(0, 15));
  }
  return result;
}

export { METRIC_UNITS, IMPERIAL_UNITS, calculateResult }
