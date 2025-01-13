// Shared Constants
const MAX_DRAG_DISTANCE = 80;

const scrollInput = document.getElementById("scrollCount");
const scrollButton = document.getElementById("scrollButton");
const scrollUpperBound = document.getElementById("upperBound");
const scrollLowerBound = document.getElementById("lowerBound");
const scrollArrowUp = document.querySelector(".scroll-icon__arrow-up");
const scrollArrowDown = document.querySelector(".scroll-icon__arrow-down");
const scrollCircle = document.querySelector(".scroll-icon__circle");

// Add click handlers for arrows
scrollArrowUp.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent triggering drag
  scrollCount = parseInt(scrollInput.value) || 0;
  scrollCount++;
  scrollInput.value = scrollCount;
});

scrollArrowDown.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent triggering drag
  scrollCount = parseInt(scrollInput.value) || 0;
  scrollCount = Math.max(0, scrollCount - 1);
  scrollInput.value = scrollCount;
});

// State
let scrollCount = 0;
let scrollStartY = 0;
let scrollCurrentY = 0;
let scrollIsActive = false;
let scrollAnimationFrameId;
let scrollHoldStartTime;

// Set circle initial state
scrollCircle.style.transform = "translateY(0)";

// Event listeners
function getClientY(e) {
  return e.touches ? e.touches[0].clientY : e.clientY;
}

function handleStart(e) {
  scrollIsActive = true;
  scrollStartY = getClientY(e);
  scrollCurrentY = scrollStartY;
  scrollHoldStartTime = Date.now();
  scrollUpperBound.classList.add("active");
  scrollLowerBound.classList.add("active");
  updateCount();
}

function handleMove(e) {
  if (!scrollIsActive) return;
  e.preventDefault();
  scrollCurrentY = getClientY(e);

  if (scrollCurrentY < scrollStartY) {
    scrollArrowDown.style.opacity = "0";
    scrollArrowUp.style.opacity = "1";
    scrollCircle.style.transform = "translateY(-1px)";
  } else {
    scrollArrowUp.style.opacity = "0";
    scrollArrowDown.style.opacity = "1";
    scrollCircle.style.transform = "translateY(1px)";
  }
}

function handleEnd() {
  scrollIsActive = false;
  cancelAnimationFrame(scrollAnimationFrameId);
  scrollUpperBound.classList.remove("active");
  scrollLowerBound.classList.remove("active");
  scrollArrowUp.style.opacity = "1";
  scrollArrowDown.style.opacity = "1";
  scrollCircle.style.transform = "translateY(0)";
}

// Mouse Events
scrollButton.addEventListener("mousedown", handleStart);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleEnd);

// Touch Events
scrollButton.addEventListener("touchstart", handleStart);
scrollButton.addEventListener("touchmove", handleMove);
scrollButton.addEventListener("touchend", handleEnd);
scrollButton.addEventListener("touchcancel", handleEnd);

// Prevent unwanted behaviors
scrollButton.addEventListener("dragstart", (e) => e.preventDefault());

function updateCount() {
  if (!scrollIsActive) return;

  const distance = Math.abs(scrollCurrentY - scrollStartY);
  const direction = scrollStartY > scrollCurrentY ? 1 : -1;
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
    // Zone 4: 20x faster than Zone 3 (70-80px)
    const zoneProgress = (clampedDistance - 70) / 10;
    accelerationFactor = 0.07 + Math.pow(zoneProgress, 2) * 0.8;
  }

  const increment = accelerationFactor * 30;

  if (direction > 0) {
    scrollCount += increment;
  } else {
    scrollCount = Math.max(0, scrollCount - increment);
  }

  scrollInput.value = Math.floor(scrollCount);
  scrollAnimationFrameId = requestAnimationFrame(updateCount);
}