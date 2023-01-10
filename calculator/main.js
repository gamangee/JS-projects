let left = null;
let right = null;
let operator = null;
let result = false;
let resultValue = null;

function save() {
  const input = document.getElementById('topInput');

  let value = '';

  if (left === null) return;
  value += left + ' ';
  input.value = value;

  if (operator === null) return;
  value += operator + ' ';
  input.value = value;

  if (right === null) return;
  value += right + ' ';
  input.value = value;

  if (result) {
    switch (operator) {
      case '+':
        resultValue = parseInt(left) + parseInt(right);
        break;
      case '-':
        resultValue = parseInt(left) - parseInt(right);
        break;
      case '*':
        resultValue = parseInt(left) * parseInt(right);
        break;
      case '/':
        resultValue = parseInt(left) / parseInt(right);
        break;
    }
    value += '= ' + resultValue;
    input.value = value;
  }
}

function inputNum(num) {
  if (operator === null) {
    if (left === null) {
      left = `${num}`;
    } else {
      if (num === 0 && parseInt(left) === 0) return;
      left += `${num}`;
    }
  } else {
    if (right === null) {
      right = `${num}`;
    } else {
      if (num === 0 && parseInt(right) === 0) return;
      right += `${num}`;
    }
  }
  save();
}

function inputOperator(op) {
  if (left === null && op === '-') {
    left = '-';
    save();
    return;
  }

  if (left === '-') return;

  if (op === '-' && operator !== null && right === null) {
    right = '-';
    save();
    return;
  }

  operator = op;
  save();
}

function inputEqual() {
  if (left === null || right === null || !operator) {
    return;
  }
  if (result) {
    left = resultValue;
    right = null;
    resultValue = null;
    operator = null;
    result = false;
  } else {
    result = true;
  }
  save();
}
