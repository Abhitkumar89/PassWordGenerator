const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generator = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = "~!@#$%^&*_-+={}[]<>.,/?|\'";

//Initial Value
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

// Set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) / (max - min)) * 100 + "% 100%";
}

// Utility Functions
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbol.length);
    return symbol.charAt(randNum);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // Strong
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // Medium
    } else {
        setIndicator("#f00"); // Weak
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value); // Copy password to clipboard
        copyMsg.innerText = "Copied"; // Show "Copied" message
    } catch (e) {
        copyMsg.innerText = "Failed"; // Show "Failed" message if an error occurs
    }

    // Add "active" class to show the message
    copyMsg.classList.add("active");

    // Use `setTimeout` to remove the message after 2 seconds
    setTimeout(() => {
        copyMsg.classList.remove("active"); // Remove "active" class
        copyMsg.innerText = ""; // Clear the message text
    }, 2000); // 2-second delay
}


function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if (checkBox.checked) checkCount++;
    });

    // Special Condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event Listeners
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generator.addEventListener("click", () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        alert("Password length cannot be less than the number of selected options.");
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    // Create function array
    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolCheck.checked) funcArr.push(generateSymbol);

    // Add one character from each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill remaining characters
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate the strength
    calcStrength();
    
});


 






