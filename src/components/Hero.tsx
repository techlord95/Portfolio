'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import styles from './Hero.module.css';
import ResumeView from './ResumeView';
import ResumeChatbot from './ResumeChatbot';
import { useChat } from '../context/ChatContext';

export default function Hero() {
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [particles, setParticles] = useState<{x: number, y: number, color: string, vx: number, vy: number}[]>([]);
  const { setIsOpen } = useChat();

  const handleGiftClick = () => {
    if (isGiftOpen) return;
    setIsGiftOpen(true);
    triggerConfetti();
    setTimeout(() => {
        setShowResume(true);
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
      {!showResume && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', zIndex: 50 }}>
            <div className={styles.giftText}>
                Unlock resume early by clicking here
            </div>
            <div 
                className={styles.giftContainer} 
                onClick={handleGiftClick}
                style={{ 
                    position: 'relative',
                    opacity: isGiftOpen ? 0 : 1, 
                    transition: 'opacity 0.5s',
                    pointerEvents: isGiftOpen ? 'none' : 'auto',
                    marginBottom: '1rem'
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
        </div>
      )}

      {/* Render Chatbot Always */}
      <ResumeChatbot />

      {/* Resume Viewer */}
      {showResume && (
           <div className={styles.modalOverlay}>
               <div className={styles.winModal}>
                   <h2 className={styles.winTitle}>CONGRATULATIONS!</h2>
                   <p className={styles.winText}>You've unlocked the Resume!</p>
                   <div className={styles.resumeFrameContainer}>
                       <ResumeView />
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
