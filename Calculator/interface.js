const calculatorInterface = {
  updateDisplay: function(value) {},
  storeInput: function(value) {},
  storeAction: function(op) {},
  calculate: function() {},
  clearCalculator: function() {},
  addToHistory: function(entry) {},
  clearHistory: function() {},
};

let rawExpression = '';      // For eval()
let displayExpression = ''; //used these two as global variables

const display = {
  updateDisplay: function (value){
    document.getElementById("display").innerText = value || '0';
  },
  clearCalculator: function() {
    rawExpression = '';
    displayExpression = '';
    display.updateDisplay('');
    display.clearHistory();
  },
  addToHistory: function(entry) {
    const historyLog = document.getElementById("history-log");
    const newEntry = document.createElement("div");
    newEntry.innerText = entry;
    newEntry.classList.add("history-entry");
    historyLog.prepend(newEntry);
  },
  clearHistory: function() {
  const historyLog = document.getElementById("history-log");
    historyLog.innerHTML = '';
  },
};

const inputs = {
  storeInput: function(value) {
    rawExpression += value;
    displayExpression += value;
    display.updateDisplay(displayExpression);
  },
  storeAction: function(op) {
    const rawOps = {
      '+': '+',
      '-': '-',
      'mul': '*',
      'div': '/',
      'exp': '**',
      'root': `**(1/2)`,
      'percentage': `/100`
    };

  const displayOps = {
      '+': '+',
      '-': '-',
      'mul': '×',
      'div': '÷',
      'exp': '^',
      'root': `√`,
      'percentage': '%'
    };

  if (rawOps[op] && displayOps[op]) {
      rawExpression += rawOps[op];
      displayExpression += displayOps[op];
      display.updateDisplay(displayExpression);
    }
  },
};

const calculate = {
  calculate: function() {
    if (rawExpression.trim() === '') return;

    try {
        const result = eval(rawExpression);
        display.addToHistory(`${displayExpression} = ${displayExpression = result}`);
        rawExpression = result.toString();
        displayExpression = result.toString();
        display.updateDisplay(displayExpression);
        rawExpression = '';
        displayExpression = '';
    } catch {
        display.updateDisplay('Error');
        rawExpression = '';
        displayExpression = '';
    }
  },
};

document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (!isNaN(key) || key === '.') {
      inputs.storeInput(key);
  } else if (key === '+') {
    inputs.storeAction('+');
  } else if (key === '-') {
    inputs.storeAction('-');
  } else if (key === '*') {
    inputs.storeAction('mul');
  } else if (key === '/') {
    inputs.storeAction('div');
  } else if (key === 'Enter') {
      event.preventDefault();
      calculate.calculate();
  } else if (key === 'Escape') {
      display.clearCalculator();
  } else if(key === '^'){
    inputs.storeAction('exp');
  }else if(key === '%'){
    inputs.storeAction('percentage');
  }else if (key === 'Backspace') {
      rawExpression = rawExpression.slice(0, -1);
      displayExpression = displayExpression.slice(0, -1);
      display.updateDisplay(displayExpression);
  }
});