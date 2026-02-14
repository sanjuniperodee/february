import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CHECKLIST_ITEMS } from './data'
import styles from './Checklist.module.css'

export default function Checklist() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2, once: true })

  return (
    <section className={styles.section} id="checklist" ref={ref}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Что взять с собой
      </motion.h2>
      <ul className={styles.list}>
        {CHECKLIST_ITEMS.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.text}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
