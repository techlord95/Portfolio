'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import styles from './Hero.module.css';

export default function Hero() {
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [particles, setParticles] = useState<{x: number, y: number, color: string, vx: number, vy: number}[]>([]);

  const handleGiftClick = () => {
    if (isGiftOpen) return;
    setIsGiftOpen(true);
    triggerConfetti();
    setTimeout(() => {
        setShowDialog(true);
    }, 1000);
  };

  const triggerConfetti = () => {
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f'];
      const newParticles = [];
      for(let i=0; i<100; i++) {
          newParticles.push({
              x: window.innerWidth * 0.9, // Start from gift box approx position
              y: window.innerHeight * 0.5,
              color: colors[Math.floor(Math.random() * colors.length)],
              vx: (Math.random() - 0.8) * 15, // Shoot leftwards
              vy: (Math.random() - 0.5) * 15
          });
      }
      setParticles(newParticles);
  };

  useEffect(() => {
      if (particles.length > 0) {
          const interval = setInterval(() => {
              setParticles(prev => prev.map(p => ({
                  ...p,
                  x: p.x + p.vx,
                  y: p.y + p.vy,
                  vy: p.vy + 0.5 // Gravity
              })).filter(p => p.y < window.innerHeight));
          }, 16);
          return () => clearInterval(interval);
      }
  }, [particles]);

  const handleHardWay = () => {
      setShowDialog(false);
      const gameSection = document.getElementById('game-section');
      if (gameSection) {
          gameSection.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleEasyWay = () => {
      setShowDialog(false);
      setShowResume(true);
  };

  return (
    <section className={styles.hero}>
      {/* Background Scenery REMOVED */}
      {/* <div className={styles.sceneryBackground} /> */}
      {/* <div className={styles.overlay} /> */}

      {/* Confetti */}
      {particles.map((p, i) => (
          <div key={i} style={{
              position: 'absolute',
              left: p.x, top: p.y,
              width: '10px', height: '10px',
              backgroundColor: p.color,
              zIndex: 100,
              pointerEvents: 'none'
          }} />
      ))}

      {/* Birds REMOVED */}



      {/* 3D Gift Box */}
      {!showResume && !showDialog && (
        <div 
            className={styles.giftContainer} 
            onClick={handleGiftClick}
            style={{ 
                opacity: isGiftOpen ? 0 : 1, 
                transition: 'opacity 0.5s',
                pointerEvents: isGiftOpen ? 'none' : 'auto'
            }}
        >
            <div className={styles.giftBox}>
                <div className={`${styles.face} ${styles.front}`}></div>
                <div className={`${styles.face} ${styles.back}`}></div>
                <div className={`${styles.face} ${styles.right}`}></div>
                <div className={`${styles.face} ${styles.left}`}></div>
                <div className={`${styles.face} ${styles.bottom}`}></div>
                
                {/* Lid */}
                <div className={styles.lidTop} style={{ 
                    transform: isGiftOpen 
                        ? 'translateY(-60px) rotateX(120deg) translateZ(10px)' 
                        : 'translateY(0) rotateX(90deg) translateZ(50px)',
                    transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                </div>
            </div>
        </div>
      )}

      {/* Initial Congratulations Dialog */}
      {showDialog && (
          <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                  <h2 className={styles.modalTitle}>🎉 Congratulations! 🎉</h2>
                  <p className={styles.modalText}>
                      You've unlocked the resume early! <br/>
                      Do you want to try unlocking it the <b>harder way</b> (Mario Game)?
                  </p>
                  <div className={styles.buttonGroup}>
                      <button className={styles.btnPrimary} onClick={handleHardWay}>Yes, I like a challenge!</button>
                      <button className={styles.btnSecondary} onClick={handleEasyWay}>No, show me the resume.</button>
                  </div>
              </div>
          </div>
      )}

      {/* Resume Viewer */}
      {showResume && (
           <div className={styles.modalOverlay}>
               <div className={styles.winModal}>
                   <h2 className={styles.winTitle}>CONGRATULATIONS!</h2>
                   <p className={styles.winText}>You've unlocked the Resume!</p>
                   <div className={styles.resumeFrameContainer}>
                       <iframe src="/resume.pdf" width="100%" height="100%" style={{ border: 'none' }}></iframe>
                   </div>
                   <div className={styles.btnGroup}>
                        <button className={`${styles.btnGame} ${styles.btnClose}`} onClick={() => {setShowResume(false); setIsGiftOpen(false); }}>
                            CLOSE
                        </button>
                   </div>
               </div>
           </div>
      )}

      <div className={styles.content}>
        <h1 className={styles.heading}>
            <ReactTyped
                strings={["IMAGINE", "CREATION", "TRY"]}
                typeSpeed={100}
                backSpeed={60}
                backDelay={2000}
                loop
                shuffle
                showCursor={false}
                startDelay={500}
            />
        </h1>
         <h1 className={styles.heading} style={{ marginLeft: '5vw' }}>
            <ReactTyped
                strings={["CREATE", "EVOLUTION", "BUILD"]}
                typeSpeed={100}
                backSpeed={60}
                backDelay={2000}
                loop
                shuffle
                showCursor={false}
                startDelay={2000}
            />
        </h1>
         <h1 className={styles.heading} style={{ marginRight: '5vw' }}>
            <ReactTyped
                strings={["INSPIRE", "TRANSFORMATION", "TRY AGAIN"]}
                typeSpeed={100}
                backSpeed={60}
                backDelay={2000}
                loop
                shuffle
                showCursor={false}
                startDelay={3500}
            />
        </h1>

        <motion.p
            className={styles.subtext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5, duration: 1 }}
        >
          Creative Developer & UI/UX Designer
        </motion.p>
      </div>

      <div className={styles.scrollIndicator}>
        Scroll to Play
      </div>
    </section>
  );
}
