/* Check if number is an integer */
function isInt(n) {
    return n % 1 === 0;
}

/* Prompt the user to get number which becomes the search limit for prime numbers.*/
const getNumber = function () {
    let userInput = window.prompt("Podaj liczbę naturalną N z przedziału 0-10000:", "Wpisz liczbę N");
    /* Validate answer: null === cancel prompt; empty string, white spaces, strings, floats and integers outside the range not allowed */
    if (userInput === null) {
        window.alert("Nie podano żadnej liczby. Spróbuj ponownie.")
    } else if (userInput.trim() !== '' && !isNaN(userInput)) {
        let userNumber = +userInput;
        if (isInt(userNumber) && userNumber >= 0 && userNumber <= 10000) {
            if (isFirstTry) { 
                document.getElementsByClassName('app__result--summary')[0].style.display = "block";
                document.getElementsByClassName('app__btn-run')[0].innerHTML = "Sprawdż inną liczbę!";
            }
            isFirstTry = false;
            let result = findPrimeNumbers(userNumber);
            console.log("number: " + result.limit);
            console.log("liczby pierwsze: " + result.primesList);
            console.log("ilość wyników: " + result.quantity);
            showResults(result);
            return userNumber;
        } else {
            window.alert("Podana liczba nie jest liczbą całkowitą z zakresu 0-10000! Spróbuj ponownie.")
            getNumber();
        }
    } else {
        window.alert("Nie podano liczby naturalnej z zakresu 0-10000! Spróbuj ponownie.")
        getNumber();
    }
}

/* Find prime numbers lower than given limit. 
    Params:
    * limit - given limit for prime numbers search
    Return: 
    * result - object with an information about: 
        * given limit, 
        * total quantity of prime numbers below the limit and 
        * the array of found prime numbers */
const findPrimeNumbers = (limit) => {
    let result = {
        'limit': limit,
        'primesList': [],
        'quantity': 0
    }
    if (limit <= 2) {
        return result;
    } else {
        result.primesList.push(2);
        for (let i = 3; i < limit; i += 2) {
            let isPrime = true;
            for (let j = 3; j * j <= i; j += 2) {
                if (i % j === 0) isPrime = false;
            }
            if (isPrime) result.primesList.push(i);
        }
        result.quantity = result.primesList.length;
        return result;
    }
}

/* Replace values on site with proper primary numbers */
const showResults = (result) => {
    const resultNum = document.getElementsByClassName('result-num')[0];
    const resultsField = document.getElementsByClassName('app__result')[0];
    const resultMsg = document.getElementsByClassName('result-msg')[0];
    const resultMsgNoResults = document.getElementsByClassName('result-msg--zero')[0];
    resultNum.innerHTML = result.limit;

    if (result.quantity === 0) {
        // Hide results field and display zero-results-message
        resultMsg.style.display = "none";
        resultMsgNoResults.style.display = "inline";
        resultsField.style.display = "none";
    } else {
        // Prepare list of results
        const resultQty = document.getElementsByClassName('result-qty')[0];
        resultQty.innerHTML = result.quantity;
        let displayResults = "";
        for (let i = 0; i < result.primesList.length; i++) {
            displayResults += result.primesList[i] + " | ";
        }
        // Hide zero-results-message and show results field
        resultMsg.style.display = "inline";
        resultMsgNoResults.style.display = "none";
        resultsField.style.display = "block";
        resultsField.innerHTML = displayResults;
    }
}

let isFirstTry = true; // initial value for user's first search
const btnRun = document.getElementsByClassName('app__btn-run');
btnRun[0].addEventListener('click', getNumber);