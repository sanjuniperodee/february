import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { CALENDAR_EVENTS } from './data'
import styles from './CalendarSection.module.css'

export default function CalendarSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2, once: true })

  const year = useMemo(() => {
    const d = new Date()
    const feb14 = new Date(d.getFullYear(), 1, 14)
    return d > feb14 ? d.getFullYear() + 1 : d.getFullYear()
  }, [])

  const links = useMemo(() => {
    const base = 'https://www.google.com/calendar/render?action=TEMPLATE'
    return CALENDAR_EVENTS.map((ev) => {
      const start = `${year}0214${ev.start}`
      const end = ev.endDate ? `${year}${ev.endDate}${ev.end}` : `${year}0214${ev.end}`
      const url = `${base}&text=${encodeURIComponent(ev.title)}&dates=${start}/${end}&details=${encodeURIComponent(ev.details)}&location=${encodeURIComponent(ev.location)}`
      return { ...ev, url }
    })
  }, [year])

  return (
    <section className={styles.section} id="calendar" ref={ref}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        В календарь
      </motion.h2>
      <motion.p
        className={styles.note}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Добавь наши три события в телефон, чтобы ничего не забыть.
      </motion.p>
      <div className={styles.links}>
        {links.map((link, i) => (
          <motion.a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener"
            className={styles.link}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
            whileHover={{ y: -2 }}
          >
            {link.label}
          </motion.a>
        ))}
      </div>
    </section>
  )
}
