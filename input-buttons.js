const buttonCount = document.getElementById("buttonCount");
const buttonUp = document.querySelector(".button-up");
const buttonDown = document.querySelector(".button-down");
let buttonValue = 0;
let holdStartTime = 0;
let holdInterval;
let isHolding = false;

function getAcceleration(holdTime) {
  const SLOW_PHASE = 1000;
  const BASE_SPEED = 1;
  
  if (holdTime <= SLOW_PHASE) {
    return BASE_SPEED;
  } else {
    const timeAfterSlow = holdTime - SLOW_PHASE;
    return BASE_SPEED + Math.pow(timeAfterSlow / 500, 3);
  }
}

function handleTap(isUp) {
  // Get current input value first
  buttonValue = parseInt(buttonCount.value) || 0;
  
  if (isUp) {
    buttonValue++;
  } else {
    buttonValue = Math.max(0, buttonValue - 1);
  }
  buttonCount.value = buttonValue;
}

function handleHold(isUp) {
  // Get current input value first
  buttonValue = parseInt(buttonCount.value) || 0;
  isHolding = true;
  holdStartTime = Date.now();
  
  holdInterval = setInterval(() => {
    const holdTime = Date.now() - holdStartTime;
    const increment = getAcceleration(holdTime);
    
    if (isUp) {
      buttonValue = Math.floor(buttonValue + increment);
    } else {
      buttonValue = Math.floor(Math.max(0, buttonValue - increment));
    }
    
    buttonCount.value = buttonValue;
  }, 16);
}

function onPointerDown(e, isUp) {
  e.preventDefault();
  const startTime = Date.now();
  
  const timer = setTimeout(() => {
    handleHold(isUp);
  }, 200);
  
  function onPointerUp() {
    clearTimeout(timer);
    if (Date.now() - startTime < 200) {
      handleTap(isUp);
    }
    clearInterval(holdInterval);
    isHolding = false;
    
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
  }
  
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);
}

buttonUp.addEventListener('pointerdown', (e) => onPointerDown(e, true));
buttonDown.addEventListener('pointerdown', (e) => onPointerDown(e, false));