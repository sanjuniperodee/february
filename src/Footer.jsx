import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { SIGNATURE } from './data'
import styles from './Footer.module.css'

export default function Footer() {
  const [heartClicks, setHeartClicks] = useState(0)
  const [showSecret, setShowSecret] = useState(false)
  const timerRef = useRef(null)

  const onHeartClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const n = 5 + Math.floor(Math.random() * 4)
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span')
      el.className = styles.burst
      el.textContent = '♥'
      el.style.left = cx + (Math.random() - 0.5) * 40 + 'px'
      el.style.top = cy + 'px'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1200)
    }
    setHeartClicks((c) => {
      const next = c + 1
      if (next >= 5) {
        setShowSecret(true)
        return 0
      }
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setHeartClicks(0), 1500)
      return next
    })
  }, [])

  return (
    <footer className={styles.footer}>
      <motion.p
        className={styles.signature}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {SIGNATURE.main}
        <br />
        <span className={styles.name}>{SIGNATURE.name}</span>
      </motion.p>
      <motion.p
        className={styles.sub}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {SIGNATURE.sub}
      </motion.p>
      <motion.a
        href="#invitation"
        className={styles.backTop}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ y: -2 }}
      >
        В начало
      </motion.a>
      <motion.button
        type="button"
        className={styles.printBtn}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={() => window.print()}
      >
        Распечатать план
      </motion.button>
      <button
        type="button"
        className={styles.footerHeart}
        onClick={onHeartClick}
        aria-label="Нажми — полетят сердечки"
        title="Нажми"
      >
        ♥
      </button>
      {showSecret && (
        <motion.p
          className={styles.secret}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Ты — глупышка
        </motion.p>
      )}
    </footer>
  )
}
