const canvas = document.getElementById('wall-canvas');
const ctx = canvas.getContext('2d');

let screenwidth = window.innerWidth;
let screenheight = window.innerHeight;
let dpr = 1.0;

let cameraX = 0;
let velocity = 0;

const acceleration = 2400;
const friction = 0.95


function handleResize() {
    screenwidth = window.innerWidth;
    screenheight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(screenwidth * dpr);
    canvas.height = Math.floor(screenheight * dpr);
}

window.addEventListener('resize', handleResize);
handleResize();

windoww.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveRight = true;
});


function gameloop() {

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Fill cream background
    ctx.fillStyle = "#E8E3D7";
    ctx.fillRect(0, 0, screenwidth, screenheight);
    
    // 2. Draw black box in center
    ctx.fillStyle = '#080808';
    ctx.fillRect(screenwidth / 2 - 50, screenheight / 2 - 50, 100, 100);

    let lastTime = performance.now();
    function gameloop(now) {
        const dt = Math.min(( now - lastTime) / 1000, 0.1);
        lastTime = now;

        let dir = 0;
        if(moveLeft) dir -= 1;
        if(moveRight) dir += 1;
        
        if (dir !== 0) {
            velocity += dor * acceleration * dt;
            velocity = Math.max (-800, Math.min(900, velocity));
        } else if (!isDragging) {
            velocity *= Math.pow(friction, dt *60);
            if (Math.abs(velocity) < 0.5) velocity = 0;
        }
        cameraX += velocity * dt

        
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.translate(screenwidth/2 - cameraX, screenheight / 2);
    // 2. Draw black box in center
         ctx.fillStyle = '#080808';
       ctx.fillRect(-50, -50, 100, 100);
    }    
        


    ctx.restore();
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);