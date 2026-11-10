const canvas = document.getElementById('wall-canvas');
const ctx = canvas.getContext('2d');

let screenwidth = window.innerWidth;
let screenheight = window.innerHeight;
let dpr = 1.0;

// Camera & Movement variables
let cameraX = 0;
let velocity = 0;
const acceleration = 2400;
const friction = 0.88; // 0.88 gives a nice smooth friction glide

// Input state flags
let moveLeft = false;
let moveRight = false;
let isDragging = false;
let lastX = 0;

function handleResize() {
    screenwidth = window.innerWidth;
    screenheight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(screenwidth * dpr);
    canvas.height = Math.floor(screenheight * dpr);
}

window.addEventListener('resize', handleResize);
handleResize();

//KEYBOARD CONTROLS
window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveRight = false;
});

//MOUSE DRAG CONTROLS
window.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    cameraX -= dx;
    velocity = -dx * 40;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

//MAIN GAME LOOP
let lastTime = performance.now();

function gameloop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // 1. Update velocity based on keys
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

    // 2. Clear background with cream color
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#E8E3D7";
    ctx.fillRect(0, 0, screenwidth, screenheight);

    // 3. Move the virtual camera!
    ctx.save();
    ctx.translate(screenwidth / 2 - cameraX, screenheight / 2);

    // 4. Draw the black box at world coordinates (0, 0)
    ctx.fillStyle = '#080808';
    ctx.fillRect(-50, -50, 100, 100);

    ctx.restore(); // restore from camera translate
    ctx.restore(); // restore from dpr scale

    // 5. Flip to next frame
    requestAnimationFrame(gameloop);
}

// Start loopie
requestAnimationFrame(gameloop);