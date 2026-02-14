import { useEffect, useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Games.module.css'

const COMBO_MS = 900

export default function GameHearts({ total = 7, onWin, onProgress }) {
  const [collectedIds, setCollectedIds] = useState(new Set())
  const [combo, setCombo] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [won, setWon] = useState(false)
  const lastCollectRef = useRef(0)

  const hearts = useMemo(
    () =>
      Array.from({ length: total }).map((_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 14 + Math.random() * 68,
        big: i < 2,
        drift: [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6],
      })),
    [total],
  )

  const collected = collectedIds.size

  useEffect(() => {
    onProgress?.(collected, total, 'Собрано')
  }, [collected, total, onProgress])

  useEffect(() => {
    if (collected < total) return
    setWon(true)
    const t = setTimeout(() => onWin?.(), 900)
    return () => clearTimeout(t)
  }, [collected, total, onWin])

  const collect = (id) => {
    if (collectedIds.has(id)) return
    const now = Date.now()
    const isCombo = now - lastCollectRef.current < COMBO_MS
    lastCollectRef.current = now
    setCollectedIds((prev) => new Set(prev).add(id))
    if (isCombo) {
      setCombo((c) => c + 1)
      setShowCombo(true)
      setTimeout(() => setShowCombo(false), 500)
    } else {
      setCombo(1)
    }
  }

  return (
    <div className={styles.heartsField}>
      {showCombo && combo > 1 && (
        <motion.span
          className={styles.heartsCombo}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          Комбо ×{combo}!
        </motion.span>
      )}
      {won && (
        <motion.p
          className={styles.heartsWon}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Всё собрано! ♥
        </motion.p>
      )}
      {hearts.map((heart, i) => {
        const collectedNow = collectedIds.has(heart.id)
        if (collectedNow) return null
        return (
          <motion.button
            key={heart.id}
            type="button"
            className={`${styles.heart} ${heart.big ? styles.heartBig : ''}`}
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: ['-50%', `calc(-50% + ${heart.drift[0]}px)`, '-50%'],
              y: ['-50%', `calc(-50% + ${heart.drift[1]}px)`, '-50%'],
            }}
            transition={{
              scale: { delay: i * 0.08, type: 'spring', stiffness: 300, damping: 22 },
              opacity: { delay: i * 0.08, duration: 0.3 },
              x: { duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 2.2 + i * 0.15, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => collect(heart.id)}
          >
            ♥
          </motion.button>
        )
      })}
    </div>
  )
}
