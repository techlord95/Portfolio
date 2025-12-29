'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './GameSection.module.css';

// --- Constants & Types ---
const TILE_SIZE = 32;
const GRAVITY = 0.5;
const FRICTION = 0.8;
const MAX_SPEED = 6;
const JUMP_FORCE = -14;

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  type: string;
  dead?: boolean;
  frame?: number;
  flip?: boolean;
  big?: boolean;
}

// Add confetti simple implementation or usage
const COLORS = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

// 0: Sky, 1: Ground, 2: Brick, 3: Question, 4: Pipe-L, 5: Pipe-R, 6: Pipe-Top-L, 7: Pipe-Top-R
const LEVEL_MAP = [
  "                                                                                                   ",
  "                                                                                                   ",
  "                                                                                                   ",
  "                                                                                                   ",
  "                                                                                                   ",
  "                      33333                                                                        ",
  "                                                                                                   ",
  "                  2222222222                                        67                             ",
  "                                                                    45                             ",
  "        3                                  232    3                 45                             ",
  "                                                                    45                             ",
  "                111111                                              45                             ",
  "     11    111  111111                                              45                             ",
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
];

export default function GameSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false); // Win state
  const [mushroomCount, setMushroomCount] = useState(0); // Track collected mushrooms
  const [showChoiceModal, setShowChoiceModal] = useState(false); // Modal for 2nd mushroom
  const [gameMessage, setGameMessage] = useState<string | null>(null); // In-game notices
  const requestRef = useRef<number>(0);

  // Game State
  const gameState = useRef({
    keys: { left: false, right: false, up: false, down: false },
    player: { x: 50, y: 100, width: 28, height: 28, dx: 0, dy: 0, type: 'player', frame: 0, flip: false, big: false } as Entity & { big?: boolean },
    enemies: [] as Entity[],
    items: [] as Entity[],
    particles: [] as any[],
    cameraX: 0,
    tiles: [] as number[][],
    frameCount: 0
  });

  // --- Initialization ---
  const initGame = () => {
    // Parse level map
    const tiles = LEVEL_MAP.map(row => row.split('').map(char => parseInt(char) || 0));
    gameState.current.tiles = tiles;

    // Reset Player
    gameState.current.player = { x: 100, y: 100, width: 24, height: 30, dx: 0, dy: 0, type: 'player', frame: 0, flip: false, big: false };
    gameState.current.cameraX = 0;
    
    // Spawn Enemies (Goombas)
    gameState.current.enemies = [
        { x: 400, y: 300, width: 30, height: 30, dx: -1, dy: 0, type: 'goomba' },
        { x: 700, y: 300, width: 30, height: 30, dx: -1, dy: 0, type: 'goomba' },
        { x: 1100, y: 300, width: 30, height: 30, dx: -1, dy: 0, type: 'goomba' },
    ];
    
    gameState.current.items = [];
    gameState.current.particles = [];
    setScore(0);
    setGameWon(false);
    setMushroomCount(0);
    setShowChoiceModal(false);
    setGameMessage(null);
  };

  // --- Rendering Functions (Pixel Art) ---
  const drawPlayer = (ctx: CanvasRenderingContext2D, p: Entity) => {
    ctx.save();
    ctx.translate(Math.floor(p.x), Math.floor(p.y));
    if (p.flip) {
        ctx.translate(p.width, 0);
        ctx.scale(-1, 1);
    }
    
    if (p.big) {
        ctx.scale(1.2, 1.3); // Grow
        ctx.translate(0, -6); // Adjust pivot
    }

    // Mario-style simple shapes
    // Hat
    ctx.fillStyle = '#f00';
    ctx.fillRect(0, 0, 24, 6);
    ctx.fillRect(4, 0, 16, 8); // Brim

    // Face
    ctx.fillStyle = '#ffe0a8';
    ctx.fillRect(4, 6, 18, 10);
    // Moustache
    ctx.fillStyle = '#000';
    ctx.fillRect(14, 12, 8, 2);

    // Shirt (Red)
    ctx.fillStyle = '#f00';
    ctx.fillRect(2, 16, 20, 14);

    // Overalls (Blue)
    ctx.fillStyle = '#00f';
    ctx.fillRect(4, 20, 16, 10);
    ctx.fillRect(2, 22, 6, 8); // Straps/Arms area approximation

    // Buttons
    ctx.fillStyle = '#ff0';
    ctx.fillRect(6, 22, 2, 2);
    ctx.fillRect(16, 22, 2, 2);

    ctx.restore();
  };

  const drawGoomba = (ctx: CanvasRenderingContext2D, e: Entity) => {
      const walkCycle = Math.floor(gameState.current.frameCount / 10) % 2;
      ctx.save();
      ctx.translate(e.x, e.y);
      
      // Head
      ctx.fillStyle = '#A04000'; // Brown
      ctx.beginPath();
      ctx.moveTo(15, 0); 
      ctx.lineTo(30, 10);
      ctx.lineTo(30, 25);
      ctx.lineTo(0, 25);
      ctx.lineTo(0, 10);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(6, 8, 6, 8);
      ctx.fillRect(18, 8, 6, 8);
      ctx.fillStyle = '#000';
      ctx.fillRect(8, 10, 2, 4);
      ctx.fillRect(20, 10, 2, 4);

      // Feet (Animated)
      ctx.fillStyle = '#000';
      if (walkCycle === 0) {
          ctx.fillRect(0, 25, 10, 5);
          ctx.fillRect(20, 25, 10, 5);
      } else {
          ctx.fillRect(5, 25, 20, 5); // Tucked in for waddle
      }
      ctx.restore();
  };

  const drawItem = (ctx: CanvasRenderingContext2D, item: Entity) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      // Mushroom Cap
      ctx.fillStyle = '#ff0000'; // Red
      ctx.beginPath();
      ctx.arc(16, 16, 14, Math.PI, 0); // Top half circle
      ctx.fill();
      // Spots
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(16, 8, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, 12, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(26, 12, 3, 0, Math.PI * 2); ctx.fill();

      // Stem
      ctx.fillStyle = '#ffe0a8';
      ctx.fillRect(8, 16, 16, 14);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(12, 19, 2, 4);
      ctx.fillRect(18, 19, 2, 4);
      ctx.restore();
  };

  const drawTile = (ctx: CanvasRenderingContext2D, id: number, x: number, y: number) => {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      if (id === 1) { // Ground
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#00AA00';
          ctx.fillRect(px, py, TILE_SIZE, 6);
          ctx.fillStyle = '#5D2906';
          ctx.fillRect(px + 4, py + 10, 4, 4);
          ctx.fillRect(px + 20, py + 18, 4, 4);
      } else if (id === 2) { // Brick
          ctx.fillStyle = '#B22222';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#000';
          ctx.fillRect(px, py + 8, TILE_SIZE, 2);
          ctx.fillRect(px, py + 20, TILE_SIZE, 2);
          ctx.fillRect(px + 16, py, 2, 8);
          ctx.fillRect(px + 8, py + 8, 2, 12);
          ctx.fillRect(px + 24, py + 8, 2, 12);
          ctx.fillRect(px + 16, py + 20, 2, 12);
      } else if (id === 3) { // Question
          ctx.fillStyle = '#FFD700'; // Gold
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#B8860B';
          ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 20px monospace';
          ctx.fillText('?', px + 8, py + 24);
          
          // Visual Hint for Mushroom (Red Dot)
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.arc(px + 26, py + 6, 3, 0, Math.PI*2);
          ctx.fill();

          ctx.fillStyle = '#000';
          ctx.fillRect(px + 2, py + 2, 2, 2);
          ctx.fillRect(px + 28, py + 2, 2, 2);
          ctx.fillRect(px + 2, py + 28, 2, 2);
          ctx.fillRect(px + 28, py + 28, 2, 2);
      }
      else if (id >= 4 && id <= 7) { // Pipe
          ctx.fillStyle = '#00AA00';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(px + 4, py, 4, TILE_SIZE);
          ctx.fillRect(px + 12, py, 2, TILE_SIZE);
          ctx.fillStyle = '#004400';
          ctx.fillRect(px + 20, py, 6, TILE_SIZE);
          if (id >= 6) { 
              ctx.fillStyle = '#000';
              ctx.fillRect(px, py + TILE_SIZE - 2, TILE_SIZE, 2);
          }
      }
  };


  // --- Game Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 448;
    ctx.imageSmoothingEnabled = false;

    const checkCollision = (rect: Entity, dx: number, dy: number) => {
        const tiles = gameState.current.tiles;
        const nextX = rect.x + dx;
        const nextY = rect.y + dy;
        
        const top = Math.floor(nextY / TILE_SIZE);
        const bottom = Math.floor((nextY + rect.height - 0.1) / TILE_SIZE);
        const left = Math.floor(nextX / TILE_SIZE);
        const right = Math.floor((nextX + rect.width - 0.1) / TILE_SIZE);
        
        if (top < 0 || bottom >= tiles.length || left < 0 || right >= tiles[0].length) {
            return false;
        }

        const tl = tiles[top][left];
        const tr = tiles[top][right];
        const bl = tiles[bottom][left];
        const br = tiles[bottom][right];

        if (tl || tr || bl || br) {
            // Check interaction
            if (dy < 0 && (tl === 2 || tr === 2 || tl === 3 || tr === 3)) {
                // Break or Hit
                const tileX = tl ? left : right;
                if (gameState.current.tiles[top][tileX] === 2) {
                     // Break brick
                    if (gameState.current.player.big) { // Only big mario breaks bricks
                        gameState.current.tiles[top][tileX] = 0;
                        gameState.current.particles.push({x: tileX * 32, y: top * 32, dy: -5, life: 20});
                    } else {
                        // Small mario just bumps
                        gameState.current.particles.push({x: tileX * 32, y: top * 32, dy: -2, life: 5}); // Dust
                    }
                }
                if (gameState.current.tiles[top][tileX] === 3) {
                     gameState.current.tiles[top][tileX] = 2; // Turn to used/brick representation
                     // Spawn Mushroom
                     gameState.current.items.push({
                        x: tileX * 32,
                        y: (top - 1) * 32,
                        width: 32,
                        height: 32,
                        dx: 2,
                        dy: 0,
                        type: 'mushroom'
                     });
                }
            }
            return true;
        }
        return false;
    };

    const loop = () => {
        if (!isPlaying && !gameWon && !showChoiceModal) return; 
        
        if (showChoiceModal) return; // Pause for modal

        // Win Render
        if (gameWon) {
             const ctx = canvasRef.current?.getContext('2d');
             if (!ctx) return;
             ctx.fillStyle = '#000'; ctx.fillRect(0,0, 800, 448);
             gameState.current.particles.forEach((p, i) => {
                 ctx.fillStyle = p.color || '#fff'; ctx.fillRect(p.x, p.y, 8, 8);
                 p.x += p.dx; p.y += p.dy;
                 if (p.y > 450) p.y = -10;
            });
            requestRef.current = requestAnimationFrame(loop);
            return;
        }

        gameState.current.frameCount++;
        
        const state = gameState.current;
        const player = state.player;

        // Player Physics
        if (state.keys.right) {
            player.dx += 0.5;
            player.flip = false;
        }
        else if (state.keys.left) {
            player.dx -= 0.5;
            player.flip = true;
        }
        else {
            player.dx *= FRICTION;
        }
        
        player.dx = Math.max(Math.min(player.dx, MAX_SPEED), -MAX_SPEED);
        
        // X Collision
        if (!checkCollision(player, player.dx, 0)) {
            player.x += player.dx;
        } else {
            player.dx = 0;
        }
        
        // Gravity
        player.dy += GRAVITY;
        
        // Jump
        if (state.keys.up) {
             if (checkCollision(player, 0, 1)) {
                 player.dy = JUMP_FORCE;
             }
        }

        // Y Collision
        if (!checkCollision(player, 0, player.dy)) {
            player.y += player.dy;
        } else {
            player.dy = 0;
            player.y = Math.round(player.y); 
        }

        // Fall death
        if (player.y > canvas.height) {
            initGame();
            return;
        }

        // Win Condition (End of Level)
        // Level Width approx 3100
        if (player.x > 3000 && !gameWon) {
             setGameWon(true);
             setIsPlaying(false);
             // Spawn Confetti
             for(let i=0; i<100; i++) {
                 gameState.current.particles.push({
                     x: Math.random() * 800,
                     y: Math.random() * -450,
                     dx: Math.random()*2 - 1,
                     dy: Math.random()*3 + 2,
                     color: COLORS[Math.floor(Math.random()*COLORS.length)],
                     life: 999
                 });
             }
        }

        // Item Logic
        state.items.forEach(item => {
            if (item.dead) return;
            item.dy += GRAVITY;
            
            if (!checkCollision(item, item.dx, 0)) {
                item.x += item.dx;
            } else {
                item.dx *= -1;
            }
            
            if (!checkCollision(item, 0, item.dy)) {
                item.y += item.dy;
            } else {
                item.dy = 0;
                item.y = Math.floor(item.y / TILE_SIZE) * TILE_SIZE; // Snap to grid on floor
            }

            // Consume
            if (
                player.x < item.x + item.width &&
                player.x + player.width > item.x &&
                player.y < item.y + item.height &&
                player.y + player.height > item.y
            ) {
                 item.dead = true;
                 if (!player.big) {
                     player.big = true;
                     setScore(s => s + 1000);
                     // player.y -= 10; player.height = 40; // Keep hitbox small to avoid stuck bugs
                 }
                 
                 // Mushroom Collection Logic
                 setMushroomCount(c => {
                     const newCount = c + 1;
                     if (newCount === 1) {
                         setGameMessage("Great! Now grab the second mushroom to unlock the resume early!");
                         setTimeout(() => setGameMessage(null), 5000);
                     } else if (newCount === 2) {
                         setShowChoiceModal(true);
                     }
                     return newCount;
                 });
            }
        });
        state.items = state.items.filter(i => !i.dead);


        // Enemy Logic
        state.enemies.forEach(en => {
            if (en.dead) return;
            en.dy += GRAVITY;
            
            if (!checkCollision(en, en.dx, 0)) {
                en.x += en.dx;
            } else {
                en.dx *= -1;
            }
            
            if (!checkCollision(en, 0, en.dy)) {
                en.y += en.dy;
            } else {
                en.dy = 0;
            }

            // Player Interaction
            if (
                player.x < en.x + en.width &&
                player.x + player.width > en.x &&
                player.y < en.y + en.height &&
                player.y + player.height > en.y
            ) {
                if (player.dy > 0 && player.y + player.height < en.y + en.height * 0.5) {
                    en.dead = true;
                    player.dy = -8;
                    setScore(s => s + 200);
                } else {
                    if (player.big) {
                        player.big = false; // Take damage
                        player.y -= 10;
                        // Temp invincibility needed but for now just mini bounce
                        player.dy = -5;
                        en.dx *= -1; // Pushback enemy
                    } else {
                       initGame();
                    }
                }
            }
        });
        
        state.enemies = state.enemies.filter(e => !e.dead);

        // Camera
        if (player.x > state.cameraX + 400) {
            state.cameraX = player.x - 400;
        }

        // Draw
        ctx.fillStyle = '#5c94fc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(-state.cameraX, 0);

        // Map
        const startCol = Math.floor(state.cameraX / TILE_SIZE);
        const endCol = startCol + (canvas.width / TILE_SIZE) + 1;
        
        for (let y = 0; y < state.tiles.length; y++) {
            for (let x = startCol; x < endCol && x < state.tiles[0].length; x++) {
                const id = state.tiles[y][x];
                if (id) drawTile(ctx, id, x, y);
            }
        }
        
        // Draw Goal Pipe (Green Block)
        ctx.fillStyle = '#0f0';
        ctx.fillRect(3050, 350, 64, 96); // Big Green Pipe
        ctx.fillStyle = '#0b0';
        ctx.fillRect(3050, 350, 64, 10); // Lip
        ctx.font = '20px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('RESUME', 3055, 340);

        // Win Condition Check (Refined)
        if (player.x > 3050 && player.x < 3120 && !gameWon) {
             setGameWon(true);
             setIsPlaying(false);
             setScore(1600); // Set specific score as requested
             // Spawn Confetti
             for(let i=0; i<100; i++) {
                 gameState.current.particles.push({
                     x: Math.random() * 800,
                     y: Math.random() * -450,
                     dx: Math.random()*2 - 1,
                     dy: Math.random()*3 + 2,
                     color: ['#f00', '#0f0', '#00f', '#ff0', '#f0f'][Math.floor(Math.random()*5)],
                     life: 999
                 });
             }
        }

        // Items
        state.items.forEach(item => drawItem(ctx, item));

        // Enemies
        state.enemies.forEach(en => drawGoomba(ctx, en));

        // Player
        drawPlayer(ctx, player);

        // Particles (Game)
        state.particles.forEach((p, i) => {
             ctx.fillStyle = '#B22222';
             ctx.fillRect(p.x, p.y, 8, 8);
             p.y += 4;
             p.life--;
             if (p.life <= 0) state.particles.splice(i, 1);
        });

        ctx.restore();
        
        requestRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
        requestRef.current = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameWon, showChoiceModal]); // Added showChoiceModal to dependency array

  // Input Handling
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === 'ArrowRight' || e.code === 'KeyD') gameState.current.keys.right = true;
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') gameState.current.keys.left = true;
          if (e.code === 'ArrowUp' || e.code === 'Space') gameState.current.keys.up = true;
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
          if (e.code === 'ArrowRight' || e.code === 'KeyD') gameState.current.keys.right = false;
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') gameState.current.keys.left = false;
          if (e.code === 'ArrowUp' || e.code === 'Space') gameState.current.keys.up = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);

  const handleTouch = (key: 'left' | 'right' | 'up' | 'down', pressed: boolean) => {
      gameState.current.keys[key] = pressed;
  };

  return (
    <section id="game-section" className={styles.gameContainer}>
          <div className={styles.uiLayer}>
              
            <span>SCORE: {score} | 🍄 {mushroomCount}/2</span>
        </div>
        
        {/* Game Message Overlay */}
        {gameMessage && (
            <div style={{
                position: 'absolute', top: '20%', width: '100%', textAlign: 'center',
                color: '#fff', fontSize: '1.2rem', textShadow: '2px 2px #000', zIndex: 20
            }}>
                {gameMessage}
            </div>
        )}

        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Modal for 2nd Mushroom Choice */}
        {showChoiceModal && (
            <div className={styles.startScreen} style={{ zIndex: 100 }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>MUSHROOMS COLLECTED!</h3>
                <p style={{ color: '#ccc', marginBottom: '2rem' }}>You found 2 mushrooms. Do you want to see the resume now?</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button className={styles.startBtn} onClick={() => { setGameWon(true); setShowChoiceModal(false); }}>
                        YES, SHOW RESUME
                    </button>
                    <button className={styles.startBtn} onClick={() => { setShowChoiceModal(false); setGameMessage("Keep running to the end!"); setTimeout(()=>setGameMessage(null), 3000); }}>
                        CONTINUE GAME
                    </button>
                </div>
            </div>
        )}

        {!isPlaying && !gameWon && !showChoiceModal && (
            <div className={styles.startScreen}>
                <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>SUPER MARIO BROS</h2>
                <div style={{marginBottom: '1rem', color: '#aaa', fontSize: '0.8rem'}}>
                   Controls: Arrow Keys or On-Screen Buttons
                   <br/>Find 2 Mushrooms key blocks (marked with red dot) to unlock Resume early!
                </div>
                <button className={styles.startBtn} onClick={() => { initGame(); setIsPlaying(true); }}>
                     (CLICK TO START)
                </button>
            </div>
        )}
        
        {gameWon && (
            <div className={styles.startScreen} style={{ width: '90%', height: '90%', top: '50%' }}>
                <h2 style={{ color: '#0f0', fontSize: '2rem', marginBottom: '1rem', textShadow: '0 0 10px #0f0' }}>CONGRATULATIONS!</h2>
                <p style={{ color: '#fff', marginBottom: '1rem' }}>You've unlocked the Resume!</p>
                <div style={{ width: '100%', height: '80%', background: '#fff' }}>
                    <iframe src="/resume.pdf" width="100%" height="100%" style={{ border: 'none' }}></iframe>
                </div>
                <button className={styles.startBtn} onClick={() => { setGameWon(false); setIsPlaying(true); initGame(); }} style={{ marginTop: '1rem' }}>
                    PLAY AGAIN
                </button>
            </div>
        )}

        <div className={styles.touchControls}>
            <div className={styles.dpad}>
                <button 
                    className={styles.controlBtn} 
                    onTouchStart={() => handleTouch('left', true)} 
                    onTouchEnd={() => handleTouch('left', false)}
                    title="Move Left"
                    aria-label="Move Left"
                >←</button>
                <button 
                    className={styles.controlBtn} 
                    onTouchStart={() => handleTouch('right', true)} 
                    onTouchEnd={() => handleTouch('right', false)}
                    title="Move Right"
                    aria-label="Move Right"
                >→</button>
            </div>
             <button 
                className={`${styles.controlBtn} ${styles.actionBtn}`} 
                onTouchStart={() => handleTouch('up', true)} 
                onTouchEnd={() => handleTouch('up', false)}
                title="Jump"
                aria-label="Jump"
            >JUMP</button>
        </div>
    </section>
  );
}
