let rawExpression = '';      // For eval()
let displayExpression = '';  // For user display

function updateDisplay(value) {
    document.getElementById("display").innerText = value || '0';
}

function storeInput(value) {
    rawExpression += value;
    displayExpression += value;
    updateDisplay(displayExpression);
}

function storeAction(op) {
    const rawOps = {
        '+': '+',
        '-': '-',
        'mul': '*',
        'div': '/'
    };

    const displayOps = {
        '+': '+',
        '-': '-',
        'mul': '×',
        'div': '÷'
    };

    if (rawOps[op] && displayOps[op]) {
        rawExpression += rawOps[op];
        displayExpression += displayOps[op];
        updateDisplay(displayExpression);
    }
}

function calculate() {
    if (rawExpression.trim() === '') return;

    try {
        const result = eval(rawExpression);
        addToHistory(displayExpression = result);
        rawExpression = result.toString();
        displayExpression = result.toString();
        updateDisplay(displayExpression);
    } catch {
        updateDisplay('Error');
        rawExpression = '';
        displayExpression = '';
    }
}

function clearCalculator() {
    rawExpression = '';
    displayExpression = '';
    updateDisplay('');
    clearHistory();
}

function addToHistory(entry) {
    const historyLog = document.getElementById("history-log");
    const newEntry = document.createElement("div");
    newEntry.innerText = entry;
    newEntry.classList.add("history-entry");
    historyLog.prepend(newEntry);
}

function clearHistory() {
    const historyLog = document.getElementById("history-log");
    historyLog.innerHTML = '';
}

// ✅ Keyboard Support
document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (!isNaN(key) || key === '.') {
        storeInput(key);
    } else if (key === '+') {
        storeAction('+');
    } else if (key === '-') {
        storeAction('-');
    } else if (key === '*') {
        storeAction('mul');
    } else if (key === '/') {
        storeAction('div');
    } else if (key === 'Enter') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearCalculator();
    } else if (key === 'Backspace') {
        rawExpression = rawExpression.slice(0, -1);
        displayExpression = displayExpression.slice(0, -1);
        updateDisplay(displayExpression);
    }
});