let form = document.querySelector('form');
form.addEventListener('submit', e => {
    e.preventDefault();
    let output = document.querySelector('output');
    let firstNum = document.querySelector('#first-num').value;
    let secondNum = document.querySelector('#second-num').value;
    let operator = document.querySelector('#operator').value;
    output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);

    try {
    if (operator === '/' && secondNum == '0') {
      throw new Error('Division by zero!');
    }
    if (isNaN(firstNum) || isNaN(secondNum)) {
      throw new CustomError('Inputs must be numbers!');
    }
    output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);
    } catch (err) {
        output.innerHTML = 'Error occurred';
        console.error('Calculation Error:', err);
        if (window.TrackJS) {
            TrackJS.track(err.message);
        }
    } finally {
        console.log('Calculation attempted');
    }
});

let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));
const tableData = [
    { class_number: "cse-110", grade: 95 },
    { class_number: "cse-120", grade: 96 },
];

function onConsoleTraceClick() {
  function deepest() {
    console.trace('Trace call');
  }
  function deeper() {
    deepest();
  }
  function deep() {
    deeper();
  }
  function handleBtnClick() {
    deep();
  }
  handleBtnClick();
}

function handleButtonClick(btn) {
  const label = btn.innerText;
  switch (label) {
    case 'Console Log':
      console.log('This is a console log');
      break;
    case 'Console Error':
      console.error('This is a console error');
      break;
    case 'Console Count':
      console.count('Console Count');
      break;
    case 'Console Warn':
      console.warn('This is a console warning');
      break;
    case 'Console Assert':
      console.assert(2 === 3, 'Assertion failed: 2 does not equal 3');
      break;
    case 'Console Clear':
      console.clear();
      break;
    case 'Console Dir':
      console.dir(btn);
      break;
    case 'Console dirxml':
      console.dirxml(btn);
      break;
    case 'Console Group Start':
      console.group('Console Group');
      break;
    case 'Console Group End':
      console.groupEnd();
      break;
    case 'Console Table':
      console.table(tableData);
      break;
    case 'Start Timer':
      console.time('Timer');
      break;
    case 'End Timer':
      console.timeEnd('Timer');
      break;
    case 'Console Trace':
      onConsoleTraceClick();
      break;
    
  }
}
// step 2 
errorBtns.forEach(function attachButtonHandler(btn) {
  if (btn.innerText === 'Trigger a Global Error') return;
  btn.addEventListener('click', function buttonClickHandler() {
    handleButtonClick(btn);
  });
});

const globalErrorBtn = errorBtns.find(btn => btn.innerText === 'Trigger a Global Error');
if (globalErrorBtn) {
  globalErrorBtn.addEventListener('click', function globalErrorHandler() {
    nonexistentFunction();
  });
}

class CustomError extends Error{
    constructor(message){
        super(message);
        this.name = 'CustomError';
    }
}
window.addEventListener('error', function globalErrorListener(event) {
  console.log('Global Error Caught via addEventListener:', event.message);
  fetch('/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error ? event.error.stack : null
    })
  }).catch(err => console.warn('Failed to send error to server:', err));

  if (window.TrackJS) {
    TrackJS.track(event.message);
  }
});