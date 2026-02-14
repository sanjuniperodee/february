import { motion } from 'framer-motion'
import styles from './FloatingHearts.module.css'

const POSITIONS = [
  { left: '8%', top: '15%', size: 0.9, delay: 0 },
  { left: '18%', top: '70%', size: 1.1, delay: -2 },
  { left: '85%', top: '25%', size: 0.85, delay: -4 },
  { left: '75%', top: '60%', size: 1, delay: -1 },
  { left: '45%', top: '85%', size: 0.95, delay: -6 },
  { left: '92%', top: '45%', size: 0.8, delay: -3 },
  { left: '5%', top: '40%', size: 1.05, delay: -5 },
  { left: '55%', top: '12%', size: 0.9, delay: -7 },
  { left: '28%', top: '35%', size: 0.75, delay: -2.5 },
  { left: '70%', top: '80%', size: 1, delay: -4.5 },
]

export default function FloatingHearts() {
  return (
    <div className={styles.wrap} aria-hidden>
      {POSITIONS.map((pos, i) => (
        <motion.span
          key={i}
          className={styles.heart}
          style={{
            left: pos.left,
            top: pos.top,
            fontSize: `${pos.size}rem`,
          }}
          animate={{
            y: [0, -12, 0],
            x: [0, 8, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: pos.delay,
            ease: 'easeInOut',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}
