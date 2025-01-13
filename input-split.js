const splitInput = document.getElementById("splitCount");
const splitUpControl = document.querySelector(".split-up");
const splitDownControl = document.querySelector(".split-down");

let splitValue = 0;
let splitHoldStartTime = 0;
let splitHoldInterval;
let splitIsHolding = false;
let splitLastTapTime = 0;
let splitHoldTimer = null;

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

function handleSplitTap(isUp) {
  splitValue = parseInt(splitInput.value) || 0;
  if (isUp) {
    splitValue++;
  } else {
    splitValue = Math.max(0, splitValue - 1);
  }
  splitInput.value = splitValue;
}

function handleSplitHold(isUp) {
  if (splitIsHolding) return;
  splitIsHolding = true;
  splitValue = parseInt(splitInput.value) || 0;
  
  splitHoldInterval = setInterval(() => {
    const holdTime = Date.now() - splitHoldStartTime;
    const increment = getAcceleration(holdTime);
    
    if (isUp) {
      splitValue = Math.floor(splitValue + increment);
    } else {
      splitValue = Math.floor(Math.max(0, splitValue - increment));
    }
    splitInput.value = splitValue;
  }, 16);
}

function onSplitPointerDown(e, isUp) {
  e.preventDefault();
  splitHoldStartTime = Date.now();
  
  // Clear any existing timers
  clearTimeout(splitHoldTimer);
  clearInterval(splitHoldInterval);
  
  splitHoldTimer = setTimeout(() => {
    handleSplitHold(isUp);
  }, 300);
  
  function onPointerUp() {
    clearTimeout(splitHoldTimer);
    if (!splitIsHolding) {
      handleSplitTap(isUp);
    }
    splitIsHolding = false;
    clearInterval(splitHoldInterval);
    
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
  }
  
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);
}

// Event Listeners
splitUpControl.addEventListener('pointerdown', (e) => onSplitPointerDown(e, true));
splitDownControl.addEventListener('pointerdown', (e) => onSplitPointerDown(e, false));
splitUpControl.addEventListener('contextmenu', (e) => e.preventDefault());
splitDownControl.addEventListener('contextmenu', (e) => e.preventDefault());