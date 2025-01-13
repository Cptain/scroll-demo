const buttonInput = document.getElementById("buttonCount");
const buttonUpControl = document.querySelector(".button-up");
const buttonDownControl = document.querySelector(".button-down");

let buttonValue = 0;
let buttonHoldStartTime = 0;
let buttonHoldInterval;
let buttonIsHolding = false;
let lastTapTime = 0;
let holdTimer = null;
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
  buttonValue = parseInt(buttonInput.value) || 0;
  if (isUp) {
    buttonValue++;
  } else {
    buttonValue = Math.max(0, buttonValue - 1);
  }
  buttonInput.value = buttonValue;
}

function handleHold(isUp) {
  if (isHolding) return;
  isHolding = true;
  buttonValue = parseInt(buttonInput.value) || 0;
  
  buttonHoldInterval = setInterval(() => {
    const holdTime = Date.now() - buttonHoldStartTime;
    const increment = getAcceleration(holdTime);
    
    if (isUp) {
      buttonValue = Math.floor(buttonValue + increment);
    } else {
      buttonValue = Math.floor(Math.max(0, buttonValue - increment));
    }
    buttonInput.value = buttonValue;
  }, 16);
}

function onPointerDown(e, isUp) {
  e.preventDefault();
  buttonHoldStartTime = Date.now();
  
  // Clear any existing timers
  clearTimeout(holdTimer);
  clearInterval(buttonHoldInterval);
  
  holdTimer = setTimeout(() => {
    handleHold(isUp);
  }, 300);
  
  function onPointerUp() {
    clearTimeout(holdTimer);
    if (!isHolding) {
      handleTap(isUp);
    }
    isHolding = false;
    clearInterval(buttonHoldInterval);
    
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
  }
  
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);
}

// Event Listeners
buttonUpControl.addEventListener('pointerdown', (e) => onPointerDown(e, true));
buttonDownControl.addEventListener('pointerdown', (e) => onPointerDown(e, false));
buttonUpControl.addEventListener('contextmenu', (e) => e.preventDefault());
buttonDownControl.addEventListener('contextmenu', (e) => e.preventDefault());