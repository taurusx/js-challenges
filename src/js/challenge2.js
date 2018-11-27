/** 
 * Import *_UNITS Objects to populate dropdown select options.
 * Import @see calculateResult function which provides unit conversion.
 */
import { METRIC_UNITS, IMPERIAL_UNITS, calculateResult }
  from './challenge2-func.js';

/**
 * @constant LAST_MODIFIED - new attribute name for <input> fields
 */
const LAST_MODIFIED = "isLastModified";

/** 
 * Populate dropdown <select> Element <option>s with units from provided 
 * unit system Object.
 * 
 * @param {Object} unitsSystemObject - an Object with details about certain
 *  unit system
 * @param {HTMLElement} selectElement - a <select> Element to be populated
 *  with units
 */
const populateUnits = (unitsSystemObject, selectElement) => {
  for (const key in unitsSystemObject) {
    if (unitsSystemObject.hasOwnProperty(key)) {
      const unit = unitsSystemObject[key];
      // Create, set and add new <option>:
      const newOption = document.createElement('option');
      newOption.value = key;
      newOption.innerText = `${unit[1]} - ${unit[2]}`;
      selectElement.appendChild(newOption);
    }
  }
}

/** 
 * Sets proper 'last modified' attribute on <input> fields for passed 
 * HTMLELement which was targetted by an 'input' Event. 
 * If the attribute was 'false', so the field has not been lately modified, 
 * but 'input' Event was triggered - 'last modified' attribute becomes 'true'.
 * 
 * @param {HTMLElement} inputFieldTarget - Event targetted field to set 
 * 'last modified' attribute
 */
const lastModifiedToggle = inputFieldTarget => {
  if (inputFieldTarget.tagName === 'INPUT' &&
    inputFieldTarget.getAttribute(LAST_MODIFIED) === 'false') {
    const inputsArray = document.querySelectorAll('.input-wrapper input');
    inputsArray.forEach(input => {
      input.setAttribute(LAST_MODIFIED, false);
    })
    inputFieldTarget.setAttribute(LAST_MODIFIED, true);
  } 
}

/**
 * Callback function to handle Events that might have targetted results 
 * or calculation parameters.
 * 
 * @callback updateResults
 * @param {Event} event - Event that triggers results update
 */
const updateResults = event => {
  // If target is an input, toggle its 'last modified' attribute:
  if (event.target.hasAttribute(LAST_MODIFIED)) {
    lastModifiedToggle(event.target);
  }

  const inputSelector1 = `input[${CSS.escape(LAST_MODIFIED)}="true"]`;
  const inputSelector2 = `input[${CSS.escape(LAST_MODIFIED)}="false"]`;
  const unitSelector1 = `${inputSelector1} + div > select`;
  const unitSelector2 = `${inputSelector2} + div > select`;
  const inputField1 = document.querySelector(inputSelector1);
  const inputField2 = document.querySelector(inputSelector2);
  const unit1 = document.querySelector(unitSelector1);
  const unit2 = document.querySelector(unitSelector2);

  try {
    inputField2.value =
      calculateResult(inputField1.value, unit1.value, unit2.value);
  } catch (e) {
    inputField2.value = "Liczba zbyt długa";
    console.log(e.message);
  }
}

/**
 * Add Event listeners to allow live update of results:
 * input fields listeners, unit selection listeners and 'run button' listener
 */
const addListeners = () => {
  const runButton = document.getElementsByClassName('app__btn-run')[0];
  runButton.addEventListener('click', updateResults);

  const inputField1 = document.getElementById('value1');
  const inputField2 = document.getElementById('value2');
  inputField1.addEventListener('input', updateResults);
  inputField2.addEventListener('input', updateResults);

  const selectUnit1 = document.getElementById('unit1');
  const selectUnit2 = document.getElementById('unit2');
  selectUnit1.addEventListener('change', updateResults);
  selectUnit2.addEventListener('change', updateResults);
}

/**
 * Set up layout to prepare converter for first use after DOM document 
 * is created. 
 * Populate unit selection dropdowns, set starting unit types.
 * Set proper 'last modified' attributes.
 * Add listeners for live results update.
 */
const setUpLayout = () => {
  // Get DOM elements corresponding to dropdown selection elements:
  const unitSelection1 = document.getElementById('unit1');
  const unitSelection2 = document.getElementById('unit2');
  // Clear of any placeholder code:
  unitSelection1.innerHTML = '';
  unitSelection2.innerHTML = '';

  // Populate dropdown lists with all units:
  populateUnits(METRIC_UNITS, unitSelection1);
  populateUnits(METRIC_UNITS, unitSelection2);
  populateUnits(IMPERIAL_UNITS, unitSelection1);
  populateUnits(IMPERIAL_UNITS, unitSelection2);

  // Set starting selected options:
  unitSelection1.value = "mile"
  unitSelection2.value = "km"
  
  // Last modified field becomes input, while previous modified field 
  // is an output of calculations. Set up starting values:
  const inputField1 = document.getElementById('value1');
  const inputField2 = document.getElementById('value2');
  inputField1.setAttribute(LAST_MODIFIED, true);
  inputField2.setAttribute(LAST_MODIFIED, false);

  // Add event listeners to the layout:
  addListeners();
}

// Invoke setUpLayout() to prepare converter for first use:
setUpLayout();