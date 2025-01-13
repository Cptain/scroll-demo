// ====== CHEVRON COMPONENT ======
// Elements
const chevronInput = document.getElementById("chevronCount");
const chevronUp = document.querySelector(".chevron-up");
const chevronDown = document.querySelector(".chevron-down");

// State
let chevronHoldStartTime = 0;
let chevronHoldInterval;

function getAcceleration(holdTime) {
  const baseSpeed = 0.1;
  const maxSpeed = 5;
  const accelerationTime = 2000; // 2 seconds to reach max speed
  return Math.min(baseSpeed + (holdTime / accelerationTime) * maxSpeed, maxSpeed);
}

function startIncrement(isUp) {
  holdStartTime = Date.now();
  let currentValue = parseInt(chevronCount.value) || 0;

  holdInterval = setInterval(() => {
    const holdTime = Date.now() - holdStartTime;
    const increment = getAcceleration(holdTime);

    if (isUp) {
      currentValue += increment;
    } else {
      currentValue = Math.max(0, currentValue - increment);
    }

    chevronCount.value = Math.floor(currentValue);
  }, 16); // ~60fps
}

function stopIncrement() {
  clearInterval(holdInterval);
}

chevronUp.addEventListener("pointerdown", () => startIncrement(true));
chevronUp.addEventListener("pointerup", stopIncrement);
chevronUp.addEventListener("pointerleave", stopIncrement);

chevronDown.addEventListener("pointerdown", () => startIncrement(false));
chevronDown.addEventListener("pointerleave", stopIncrement);
chevronDown.addEventListener("pointerup", stopIncrement);

chevronInput.addEventListener("click", () => {
  chevronUp.classList.add("active");
  chevronDown.classList.add("active");
});

chevronInput.addEventListener("touchstart", () => {
  chevronUp.classList.add("active");
  chevronDown.classList.add("active");
});

chevronInput.addEventListener("blur", () => {
  chevronUp.classList.remove("active");
  chevronDown.classList.remove("active");
});

buttonUp.addEventListener("pointerdown", () => startIncrement(true));
buttonUp.addEventListener("pointerup", stopIncrement);
buttonUp.addEventListener("pointerleave", stopIncrement);

buttonDown.addEventListener("pointerdown", () => startIncrement(false));
buttonDown.addEventListener("pointerleave", stopIncrement);
buttonDown.addEventListener("pointerup", stopIncrement);
