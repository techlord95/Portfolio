'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import styles from './ThemeEditor.module.css';
import { FaCog, FaTimes, FaUndo } from 'react-icons/fa';

export default function ThemeEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, updateColor, resetTheme } = useTheme();

  return (
    <>
      <motion.button
        className={styles.toggleButton}
        onClick={() => setIsOpen(true)}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        whileHover={{ rotate: 90 }}
      >
        <FaCog />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={styles.panel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className={styles.header}>
                <h3>Customize Theme</h3>
                <button onClick={() => setIsOpen(false)} className={styles.closeBtn}><FaTimes /></button>
              </div>

              <div className={styles.controls}>
                <div className={styles.controlGroup}>
                  <label>Mouse Pointer</label>
                  <div className={styles.inputWrapper}>
                    <input 
                        type="color" 
                        value={colors.pointer} 
                        onChange={(e) => updateColor('pointer', e.target.value)} 
                    />
                    <span>{colors.pointer}</span>
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <label>Text Color</label>
                  <div className={styles.inputWrapper}>
                    <input 
                        type="color" 
                        value={colors.text} 
                        onChange={(e) => updateColor('text', e.target.value)} 
                    />
                    <span>{colors.text}</span>
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <label>Background</label>
                  <div className={styles.inputWrapper}>
                    <input 
                        type="color" 
                        value={colors.background} 
                        onChange={(e) => updateColor('background', e.target.value)} 
                    />
                    <span>{colors.background}</span>
                  </div>
                </div>


              </div>

              <button className={styles.resetBtn} onClick={resetTheme}>
                <FaUndo /> Reset to Default
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
