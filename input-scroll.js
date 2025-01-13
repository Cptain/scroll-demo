// Shared Constants
const MAX_DRAG_DISTANCE = 20;

const button = document.getElementById("scrollButton");
const scrollInput = document.getElementById("scrollCount");
const upperBound = document.getElementById("upperBound");
const lowerBound = document.getElementById("lowerBound");
const arrowUp = document.querySelector(".scroll-icon__arrow-up");
const arrowDown = document.querySelector(".scroll-icon__arrow-down");
const circle = document.querySelector(".scroll-icon__circle");

// State
let count = 0;
let startY = 0;
let currentY = 0;
let isActive = false;
let animationFrameId;

// Set circle initial state
circle.style.transform = "translateY(0)";

// Event listeners
button.addEventListener("touchstart", (e) => {
  isActive = true;
  startY = e.touches[0].clientY;
  currentY = startY;
  upperBound.classList.add("active");
  lowerBound.classList.add("active");
  updateCount();
});

button.addEventListener("touchmove", (e) => {
  if (!isActive) return;
  currentY = e.touches[0].clientY;

  if (currentY < startY) {
    arrowDown.style.opacity = "0";
    arrowUp.style.opacity = "1";
    circle.style.transform = "translateY(-1px)";
  } else {
    arrowUp.style.opacity = "0";
    arrowDown.style.opacity = "1";
    circle.style.transform = "translateY(1px)";
  }
});

button.addEventListener("touchend", () => {
  isActive = false;
  cancelAnimationFrame(animationFrameId);
  upperBound.classList.remove("active");
  lowerBound.classList.remove("active");
  arrowUp.style.opacity = "1";
  arrowDown.style.opacity = "1";
  circle.style.transform = "translateY(0)";
});

function updateCount() {
  if (!isActive) return;

  const distance = Math.abs(currentY - startY);
  const direction = startY > currentY ? 1 : -1;
  const clampedDistance = Math.min(distance, MAX_DRAG_DISTANCE);

  const percentage = clampedDistance / MAX_DRAG_DISTANCE;

  let accelerationFactor;
  if (percentage <= 0.5) {
    // Keep ultra-precise control for first 50%
    accelerationFactor = percentage * 0.005;
  } else {
    // Smoother cubic acceleration for last 50%
    const normalizedPercentage = (percentage - 0.5) * 2; // Scale 0.5-1 to 0-1
    accelerationFactor = Math.pow(normalizedPercentage, 3) * 0.3 + 0.0025; // Cubic curve with reduced max
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