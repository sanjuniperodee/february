import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { EVENTS } from './data'
import TimelineCard from './TimelineCard'
import styles from './Timeline.module.css'

const stagger = {
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  hidden: {},
}
const item = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Timeline({ unlocked, onUnlock, onPlayGame }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.15, once: true })

  const count = unlocked.size
  const progress = (count / EVENTS.length) * 100

  return (
    <section className={styles.section} id="plan" ref={ref}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Что мы будем делать
      </motion.h2>
      <motion.div
        className={styles.progressWrap}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
      >
        <div className={styles.progressBar} role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={EVENTS.length} aria-label="Шагов открыто">
          <motion.span
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className={styles.progressText}>
          Шагов открыто: <strong>{count}</strong> из {EVENTS.length}
        </span>
      </motion.div>
      <p className={styles.hint}>Открой каждый шаг, пройдя мини-игру</p>
      <motion.ul className={styles.list} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        {EVENTS.map((event, i) => (
          <motion.li key={event.id} variants={item}>
            <TimelineCard
              event={event}
              unlocked={unlocked.has(event.id)}
              onUnlock={onUnlock}
              onPlayGame={onPlayGame}
              index={i}
            />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
