import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HERO } from './data'
import styles from './Hero.module.css'

const targetDate = new Date()
targetDate.setMonth(1)
targetDate.setDate(14)
targetDate.setHours(14, 0, 0, 0)
if (targetDate < new Date()) targetDate.setFullYear(targetDate.getFullYear() + 1)

function useCountdown() {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0, ready: false })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = targetDate - now
      if (diff <= 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0, ready: true })
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setLeft({ d, h, m, s, ready: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return left
}

export default function Hero() {
  const countdown = useCountdown()
  const countdownText = countdown.ready
    ? 'Сегодня наш день ♥'
    : `До 14 февраля: ${countdown.d} дн. ${countdown.h} ч. ${countdown.m} мин. ${countdown.s} сек.`

  return (
    <header className={styles.hero} id="invitation">
      <div className={styles.bg} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.grain} aria-hidden />
      <motion.div
        className={styles.inner}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          hidden: {},
        }}
      >
        <motion.p className={styles.label} variants={itemVariants}>
          {HERO.label}
        </motion.p>
        <motion.h1 className={styles.name} variants={itemVariants}>
          {HERO.name}
        </motion.h1>
        <motion.p className={styles.tagline} variants={itemVariants}>
          {HERO.tagline}
        </motion.p>
        <motion.p className={styles.countdown} variants={itemVariants} aria-live="polite">
          {countdownText}
        </motion.p>
        <motion.div className={styles.divider} variants={itemVariants} />
        <motion.a
          href="#plan"
          className={styles.scrollBtn}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={styles.scrollText}>Как пройдёт наш день</span>
          <span className={styles.scrollArrow}>↓</span>
        </motion.a>
      </motion.div>
    </header>
  )
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
