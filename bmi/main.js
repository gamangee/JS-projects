function onSubmit(event) {
  event.preventDefault();
  const w = parseFloat(event.target[0].value);
  const h = parseFloat(event.target[1].value);

  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    alert('적절한 값을 입력하시오');
    return;
  }

  const bmi = w / (h * h);
  //document.getElementById('bmi').innerHTML = bmi.toFixed(2);

  const result = document.getElementById('result');
  result.style.display = 'block';

  document.getElementById('bmi').innerText = bmi.toFixed(2);
  document.getElementById('meter').value = bmi.toFixed(2);

  let state = '정상';
  let common = true;

  if (bmi < 18.5) {
    state = '저체중';
    common = false;
  }
  if (bmi >= 25) {
    state = '과체중';
    common = false;
  }
  const stateEl = document.getElementById('state');
  stateEl.innerText = state;
  stateEl.style.color = common ? 'green' : 'coral';
}
