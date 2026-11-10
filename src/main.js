import { WallRenderer, CHUNK_WIDTH, WALL_HEIGHT } from './renderer.js';

const canvas = document.getElementById('wall-canvas');
const renderer = new WallRenderer(canvas);

// Screen dimensions & camera scale
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let dpr = 1.0;   
let viewScale = 1.0;

function handleResize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(screenWidth * dpr);
  canvas.height = Math.floor(screenHeight * dpr);

  viewScale = (screenHeight / WALL_HEIGHT) * 0.94;
}

window.addEventListener('resize', handleResize);
handleResize();

// Camera & Movement variables
let cameraX = 0;
let velocity = 0;
const acceleration = 2400;
const friction = 0.88;

let moveLeft = false;
let moveRight = false;
let isDragging = false;
let lastX = 0;

//KEYBOARD CONTROLS
window.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveLeft = true;
  if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveRight = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveLeft = false;
  if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveRight = false;
});

// MOUSE DRAG CONTR
window.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  cameraX -= dx / viewScale;
  velocity = -dx * 40;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// TRACKPAD / MOUSE WHEEL
window.addEventListener('wheel', (e) => {
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(delta) > 0.5) {
    cameraX += (delta * 1.5) / viewScale;
    velocity = delta * 35;
  }
}, { passive: true });

// MAIN GAME LOOP
let lastTime = performance.now();

function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // Update velocity with acceleration
  let dir = 0;
  if (moveLeft) dir -= 1;
  if (moveRight) dir += 1;

  if (dir !== 0) {
    velocity += dir * acceleration * dt;
    velocity = Math.max(-900, Math.min(900, velocity));
  } else if (!isDragging) {
    velocity *= Math.pow(friction, dt * 60);
    if (Math.abs(velocity) < 0.5) velocity = 0;
  }

  cameraX += velocity * dt;

  // paint the visible chunks
  renderer.render(cameraX, screenWidth, screenHeight, viewScale, dpr);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);