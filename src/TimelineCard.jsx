import { motion } from 'framer-motion'
import styles from './TimelineCard.module.css'

export default function TimelineCard({ event, unlocked, onPlayGame, index }) {
  return (
    <motion.article
      className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={unlocked ? { y: -4 } : undefined}
    >
      <div className={styles.content}>
        {!unlocked && (
          <div className={styles.lock}>
            <p>{event.lockText}</p>
            <button
              type="button"
              className={styles.unlockBtn}
              onClick={() => onPlayGame?.(event)}
            >
              Играть
            </button>
          </div>
        )}
        <div className={`${styles.inner} ${unlocked ? '' : styles.blurred}`}>
          <span className={styles.time}>{event.time}</span>
          <span className={styles.icon} aria-hidden>◇</span>
          <h3>{event.title}</h3>
          <p className={styles.place}>{event.place}</p>
          <p className={styles.desc}>{event.description}</p>
          <div className={styles.links}>
            {(event.links ?? []).map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
