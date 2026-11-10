export const CHUNK_WIDTH = 1600;
export const WALL_HEIGHT = 1080;

export class WallRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  render(cameraX, screenWidth, screenHeight, scale, dpr) {
    const ctx = this.ctx;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Fill  cream paper background
    ctx.fillStyle = '#E8E3D7';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // 2. Move the  camera
    ctx.save();
    ctx.translate(screenWidth / 2, screenHeight / 2);
    ctx.scale(scale, scale);
    ctx.translate(-cameraX, -WALL_HEIGHT / 2);

    
    const halfViewW = (screenWidth / 2) / scale;
    const startChunk = Math.floor((cameraX - halfViewW - 100) / CHUNK_WIDTH);
    const endChunk = Math.floor((cameraX + halfViewW + 100) / CHUNK_WIDTH);

    // 4. Draw only the visible chunks
    for (let c = startChunk; c <= endChunk; c++) {
      const worldX = c * CHUNK_WIDTH;

      // Draw vertical chunk boundary line
      ctx.strokeStyle = 'rgba(8, 8, 8, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(worldX, 0);
      ctx.lineTo(worldX, WALL_HEIGHT);
      ctx.stroke();

      
      ctx.fillStyle = '#080808';
      ctx.font = 'bold 36px monospace';
      const sign = c >= 0 ? '+' : '';
      ctx.fillText(`SECTOR ${sign}${c}`, worldX + 60, 120);

      // Draw a test box in the center of each chunk
      ctx.fillStyle = '#080808';
      ctx.fillRect(worldX + CHUNK_WIDTH / 2 - 60, WALL_HEIGHT / 2 - 60, 120, 120);
    }

    ctx.restore(); 
    ctx.restore(); 
  }
}