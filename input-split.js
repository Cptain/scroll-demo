// Add split button variables
const splitCount = document.getElementById("splitCount");
const splitUp = document.querySelector(".split-up");
const splitDown = document.querySelector(".split-down");
let splitValue = 0;

// Add event handlers for split buttons
function handleSplitTap(isUp) {
  splitValue = parseInt(splitCount.value) || 0;
  
  if (isUp) {
    splitValue++;
  } else {
    splitValue = Math.max(0, splitValue - 1);
  }
  splitCount.value = splitValue;
}

function handleSplitHold(isUp) {
  splitValue = parseInt(splitCount.value) || 0;
  isHolding = true;
  holdStartTime = Date.now();
  
  holdInterval = setInterval(() => {
    const holdTime = Date.now() - holdStartTime;
    const increment = getAcceleration(holdTime);
    
    if (isUp) {
      splitValue = Math.floor(splitValue + increment);
    } else {
      splitValue = Math.floor(Math.max(0, splitValue - increment));
    }
    
    splitCount.value = splitValue;
  }, 16);
}

function onSplitPointerDown(e, isUp) {
  e.preventDefault();
  const startTime = Date.now();
  
  const timer = setTimeout(() => {
    handleSplitHold(isUp);
  }, 200);
  
  function onPointerUp() {
    clearTimeout(timer);
    if (Date.now() - startTime < 200) {
      handleSplitTap(isUp);
    }
    clearInterval(holdInterval);
    isHolding = false;
    
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
  }
  
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);
}

// Add event listeners
splitUp.addEventListener('pointerdown', (e) => onSplitPointerDown(e, true));
splitDown.addEventListener('pointerdown', (e) => onSplitPointerDown(e, false));