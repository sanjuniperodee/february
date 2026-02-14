import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HERO } from './data'
import styles from './Intro.module.css'

export default function Intro({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = prefersReduced ? 0.6 : 2.6
  const delay = prefersReduced ? 0 : 0.4

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      const t2 = setTimeout(() => onComplete?.(), (delay + 0.3) * 1000)
      return () => clearTimeout(t2)
    }, duration * 1000)
    return () => clearTimeout(t)
  }, [onComplete, duration, delay])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className={styles.curtain}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
          />
          <motion.div
            className={styles.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              className={styles.heart}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
            >
              ♥
            </motion.span>
            <p className={styles.text}>{HERO.introText}</p>
            <div className={styles.loader}>
              <motion.span
                className={styles.loaderBar}
                animate={{ x: ['-100%', '350%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
