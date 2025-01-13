const buttonCount = document.getElementById("buttonCount");
const buttonUp = document.querySelector(".button-up");
const buttonDown = document.querySelector(".button-down");
let buttonValue = 0;

// Single click handlers
buttonUp.addEventListener('click', (e) => {
  e.preventDefault();
  buttonValue++;
  buttonCount.value = buttonValue;
});

buttonDown.addEventListener('click', (e) => {
  e.preventDefault();
  buttonValue = Math.max(0, buttonValue - 1);
  buttonCount.value = buttonValue;
});

// Long press handlers
let holdInterval;

function startIncrement(isUp) {
  holdStartTime = Date.now();
  
  holdInterval = setInterval(() => {
    const holdTime = Date.now() - holdStartTime;
    const increment = getAcceleration(holdTime);
    
    if (isUp) {
      buttonValue += increment;
    } else {
      buttonValue = Math.max(0, buttonValue - increment);
    }
    
    buttonCount.value = Math.floor(buttonValue);
  }, 16);
}

buttonUp.addEventListener('pointerdown', () => startIncrement(true));
buttonUp.addEventListener('pointerup', stopIncrement);
buttonUp.addEventListener('pointerleave', stopIncrement);

buttonDown.addEventListener('pointerdown', () => startIncrement(false));
buttonDown.addEventListener('pointerleave', stopIncrement);
buttonDown.addEventListener('pointerup', stopIncrement);