import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MESSAGE } from './data'
import styles from './MessageSection.module.css'

export default function MessageSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 4, y: -x * 4 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <section className={styles.section} id="message" ref={ref}>
      <motion.div
        className={styles.wrap}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.blockquote
          className={styles.block}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <span className={styles.quote}>"</span>
          <p>{MESSAGE}</p>
        </motion.blockquote>
      </motion.div>
    </section>
  )
}
