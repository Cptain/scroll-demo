// Shared Constants
const MAX_DRAG_DISTANCE = 80;

const button = document.getElementById("scrollButton");
const scrollInput = document.getElementById("scrollCount");
const upperBound = document.getElementById("upperBound");
const lowerBound = document.getElementById("lowerBound");
const arrowUp = document.querySelector(".scroll-icon__arrow-up");
const arrowDown = document.querySelector(".scroll-icon__arrow-down");
const circle = document.querySelector(".scroll-icon__circle");

// Add click handlers for arrows
arrowUp.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent triggering drag
  count = parseInt(scrollInput.value) || 0;
  count++;
  scrollInput.value = count;
});

arrowDown.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent triggering drag
  count = parseInt(scrollInput.value) || 0;
  count = Math.max(0, count - 1);
  scrollInput.value = count;
});

// State
let count = 0;
let startY = 0;
let currentY = 0;
let isActive = false;
let animationFrameId;
let holdStartTime;

// Set circle initial state
circle.style.transform = "translateY(0)";

// Event listeners
function getClientY(e) {
  return e.touches ? e.touches[0].clientY : e.clientY;
}

function handleStart(e) {
  isActive = true;
  startY = getClientY(e);
  currentY = startY;
  holdStartTime = Date.now();
  upperBound.classList.add("active");
  lowerBound.classList.add("active");
  updateCount();
}

function handleMove(e) {
  if (!isActive) return;
  e.preventDefault();
  currentY = getClientY(e);

  if (currentY < startY) {
    arrowDown.style.opacity = "0";
    arrowUp.style.opacity = "1";
    circle.style.transform = "translateY(-1px)";
  } else {
    arrowUp.style.opacity = "0";
    arrowDown.style.opacity = "1";
    circle.style.transform = "translateY(1px)";
  }
}

function handleEnd() {
  isActive = false;
  cancelAnimationFrame(animationFrameId);
  upperBound.classList.remove("active");
  lowerBound.classList.remove("active");
  arrowUp.style.opacity = "1";
  arrowDown.style.opacity = "1";
  circle.style.transform = "translateY(0)";
}

// Mouse Events
button.addEventListener("mousedown", handleStart);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleEnd);

// Touch Events
button.addEventListener("touchstart", handleStart);
button.addEventListener("touchmove", handleMove);
button.addEventListener("touchend", handleEnd);
button.addEventListener("touchcancel", handleEnd);

// Prevent unwanted behaviors
button.addEventListener("dragstart", (e) => e.preventDefault());

function updateCount() {
  if (!isActive) return;

  const distance = Math.abs(currentY - startY);
  const direction = startY > currentY ? 1 : -1;
  const clampedDistance = Math.min(distance, MAX_DRAG_DISTANCE);

  let accelerationFactor;
  
  if (clampedDistance <= 40) {
    // Zone 1: Slow and steady (0-40px)
    accelerationFactor = (clampedDistance / 40) * 0.01;
  } 
  else if (clampedDistance <= 55) {
    // Zone 2: 2x faster (40-55px)
    const zoneProgress = (clampedDistance - 40) / 15;
    accelerationFactor = 0.01 + Math.pow(zoneProgress, 2) * 0.02;
  } 
  else if (clampedDistance <= 70) {
    // Zone 3: 2x faster than Zone 2 (55-70px)
    const zoneProgress = (clampedDistance - 55) / 15;
    accelerationFactor = 0.03 + Math.pow(zoneProgress, 2) * 0.04;
  }
  else {
    // Zone 4: 6x faster than Zone 3 (70-80px)
    const zoneProgress = (clampedDistance - 70) / 10;
    accelerationFactor = 0.07 + Math.pow(zoneProgress, 2) * 0.24;
  }

  const increment = accelerationFactor * 30;

  if (direction > 0) {
    count += increment;
  } else {
    count = Math.max(0, count - increment);
  }

  scrollInput.value = Math.floor(count);
  animationFrameId = requestAnimationFrame(updateCount);
}