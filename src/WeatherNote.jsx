import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WeatherNote.module.css'

export default function WeatherNote() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3, once: true })

  return (
    <motion.section
      className={styles.section}
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p className={styles.text}>
        Погода в Алматы 14 февраля — проверь перед выходом ♥{' '}
        <a href="https://yandex.kz/pogoda/almaty" target="_blank" rel="noopener">
          Яндекс.Погода
        </a>
      </p>
    </motion.section>
  )
}
