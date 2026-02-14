import { useEffect, useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameHearts from './games/GameHearts'
import GameMemory from './games/GameMemory'
import GameBlockBlast from './games/GameBlockBlast'
import styles from './GameOverlay.module.css'

export default function GameOverlay({ event, onClose, onSuccess }) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLoss, setShowLoss] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' })
  const [memoryRetryKey, setMemoryRetryKey] = useState(0)

  const instruction = useMemo(() => {
    if (!event) return ''
    if (event.gameType === 'hearts') return 'Собери 7 сердечек'
    if (event.gameType === 'memory') return 'Найди все 6 пар (макс. 5 ошибок)'
    return 'Очисти 5 линий — перетащи фигуру или кликни по клетке'
  }, [event])

  const handleWin = useCallback(() => {
    setShowSuccess(true)
  }, [])

  const handleLoss = useCallback(() => {
    setShowLoss(true)
  }, [])

  const handleClose = useCallback(() => {
    if (showSuccess && event?.id) onSuccess?.(event.id)
    setShowSuccess(false)
    setShowLoss(false)
    onClose?.()
  }, [showSuccess, event?.id, onSuccess, onClose])

  const handleMemoryRetry = useCallback(() => {
    setShowLoss(false)
    setMemoryRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    setShowSuccess(false)
    setShowLoss(false)
    setProgress({ current: 0, total: 0, label: '' })
  }, [event?.id])

  if (!event) return null

  const successSub = `Шаг ${event.id} открыт`
  const hasProgress = progress.total > 0

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className={styles.instruction}>{instruction}</p>
          {hasProgress && (
            <p className={styles.counter}>
              {progress.label}: <strong>{progress.current}</strong> / {progress.total}
            </p>
          )}
          <div className={styles.area}>
            {event.gameType === 'hearts' && (
              <GameHearts
                total={7}
                onWin={handleWin}
                onProgress={(current, total, label) => setProgress({ current, total, label })}
              />
            )}
            {event.gameType === 'memory' && (
              <GameMemory
                key={memoryRetryKey}
                onWin={handleWin}
                onLose={handleLoss}
                onProgress={(current, total, label) => setProgress({ current, total, label })}
              />
            )}
            {event.gameType === 'blockblast' && (
              <GameBlockBlast
                goal={5}
                onWin={handleWin}
                onProgress={(current, total, label) => setProgress({ current, total, label })}
              />
            )}
          </div>
          <div className={`${styles.success} ${showSuccess ? styles.show : ''}`}>
            <span className={styles.successHeart}>♥</span>
            <p className={styles.successTitle}>Открыто!</p>
            <p className={styles.successSub}>{successSub}</p>
            <button type="button" className={styles.revealBtn} onClick={handleClose}>
              Закрыть
            </button>
          </div>
          <div className={`${styles.loss} ${showLoss ? styles.show : ''}`}>
            <span className={styles.lossIcon}>😢</span>
            <p className={styles.lossTitle}>Попытки кончились</p>
            <p className={styles.lossSub}>5 ошибок — попробуй ещё раз!</p>
            <button type="button" className={styles.retryBtn} onClick={handleMemoryRetry}>
              Попробовать снова
            </button>
            <button type="button" className={styles.revealBtnSecondary} onClick={handleClose}>
              Закрыть
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
