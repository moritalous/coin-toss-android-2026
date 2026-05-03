const coinButton = document.querySelector("#coinButton");
const coin = document.querySelector("#coin");

const state = {
  angle: 0,
  speed: 0,
  mode: "idle",
  lastTime: 0,
  releaseStartedAt: 0,
  releaseDuration: 0,
  releaseFrom: 0,
  releaseTo: 0,
  landingSide: "heads",
  activePointerId: null,
};

function setCoinAngle(angle) {
  coin.style.transform = `rotateY(${angle}deg)`;
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animationLoop(time) {
  if (!state.lastTime) {
    state.lastTime = time;
  }

  const dt = Math.min((time - state.lastTime) / 1000, 0.04);
  state.lastTime = time;

  if (state.mode === "holding") {
    state.speed = Math.min(state.speed + 1300 * dt, 1680);
    state.angle += state.speed * dt;
    setCoinAngle(state.angle);
  }

  if (state.mode === "releasing") {
    const elapsed = time - state.releaseStartedAt;
    const progress = Math.min(elapsed / state.releaseDuration, 1);
    const eased = easeOutCubic(progress);

    state.angle = state.releaseFrom + (state.releaseTo - state.releaseFrom) * eased;
    setCoinAngle(state.angle);

    if (progress >= 1) {
      state.mode = "idle";
      state.angle = state.releaseTo;
      state.speed = 0;
      coinButton.classList.remove("is-spinning");
      setCoinAngle(state.angle);
      coinButton.setAttribute("aria-label", "もう一度コイントスを開始");
    }
  }

  requestAnimationFrame(animationLoop);
}

function startHolding(pointerId = null) {
  if (state.mode === "holding") {
    return;
  }

  state.mode = "holding";
  state.speed = Math.max(state.speed, 720);
  state.lastTime = 0;
  state.activePointerId = pointerId;
  coinButton.classList.add("is-holding", "is-spinning");
  coinButton.setAttribute("aria-label", "指を離してコイントス");
}

function releaseCoin() {
  if (state.mode !== "holding") {
    return;
  }

  const side = Math.random() >= 0.5 ? "heads" : "tails";
  const targetRemainder = side === "heads" ? 0 : 180;
  const current = normalizeAngle(state.angle);
  const deltaToTarget = (targetRemainder - current + 360) % 360;
  const extraTurns = 4 + Math.floor(Math.random() * 4);
  const travel = deltaToTarget + extraTurns * 360;

  state.mode = "releasing";
  state.releaseStartedAt = performance.now();
  state.releaseDuration = 1800 + Math.min(state.speed, 1680) * 0.55 + Math.random() * 420;
  state.releaseFrom = state.angle;
  state.releaseTo = state.angle + travel;
  state.landingSide = side;
  state.activePointerId = null;
  coinButton.classList.remove("is-holding");
}

coinButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  coinButton.setPointerCapture(event.pointerId);
  startHolding(event.pointerId);
});

coinButton.addEventListener("pointerup", (event) => {
  if (state.activePointerId !== null && state.activePointerId !== event.pointerId) {
    return;
  }

  event.preventDefault();
  releaseCoin();
});

coinButton.addEventListener("pointercancel", releaseCoin);
coinButton.addEventListener("lostpointercapture", () => {
  if (state.mode === "holding") {
    releaseCoin();
  }
});

coinButton.addEventListener("keydown", (event) => {
  if (event.code !== "Space" && event.code !== "Enter") {
    return;
  }

  event.preventDefault();
  startHolding();
});

coinButton.addEventListener("keyup", (event) => {
  if (event.code !== "Space" && event.code !== "Enter") {
    return;
  }

  event.preventDefault();
  releaseCoin();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

requestAnimationFrame(animationLoop);
