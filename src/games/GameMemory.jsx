import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Games.module.css'

const PAIRS = 6
const MAX_MISTAKES = 5
const SYMBOLS = ['♥', '★', '◆', '♠', '♣', '♦']
const PEEK_MS = 2800
const WRONG_MS = 700

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GameMemory({ onWin, onLose, onProgress }) {
  const onWinRef = useRef(onWin)
  const onLoseRef = useRef(onLose)
  onWinRef.current = onWin
  onLoseRef.current = onLose
  const [phase, setPhase] = useState('peek')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [lock, setLock] = useState(false)
  const isLost = mistakes >= MAX_MISTAKES

  const deck = useMemo(() => {
    const pairs = SYMBOLS.slice(0, PAIRS).flatMap((s) => [s, s])
    return shuffle(pairs).map((symbol, id) => ({ id, symbol }))
  }, [])

  useEffect(() => {
    setCards(deck)
  }, [deck])

  useEffect(() => {
    if (phase !== 'peek') return
    const t = setTimeout(() => setPhase('play'), PEEK_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    onProgress?.(matched.size, PAIRS, 'Пар найдено')
  }, [matched.size, onProgress])

  useEffect(() => {
    if (matched.size >= PAIRS) {
      const t = setTimeout(() => onWinRef.current?.(), 500)
      return () => clearTimeout(t)
    }
  }, [matched.size])

  useEffect(() => {
    if (isLost) {
      const t = setTimeout(() => onLoseRef.current?.(), 600)
      return () => clearTimeout(t)
    }
  }, [isLost])

  const open = (id) => {
    if (phase !== 'play' || lock || isLost) return
    if (flipped.length === 2 || flipped.includes(id) || matched.has(cards[id]?.symbol)) return
    const next = [...flipped, id]
    setFlipped(next)
    if (next.length !== 2) return
    setLock(true)
    const [a, b] = next
    const match = cards[a].symbol === cards[b].symbol
    if (match) {
      setMatched((m) => new Set(m).add(cards[a].symbol))
      setFlipped([])
      setLock(false)
    } else {
      setMistakes((m) => m + 1)
      setTimeout(() => {
        setFlipped([])
        setLock(false)
      }, WRONG_MS)
    }
  }

  const isOpen = (id) => phase === 'peek' || flipped.includes(id) || matched.has(cards[id]?.symbol)
  const isMatched = (id) => matched.has(cards[id]?.symbol)

  return (
    <div className={styles.memoryWrap}>
      {phase === 'peek' && (
        <p className={styles.memoryHint}>Запомни карточки!</p>
      )}
      {phase === 'play' && !isLost && (
        <p className={styles.memoryHint}>Найди все пары</p>
      )}
      {phase === 'play' && (
        <p className={styles.memoryMistakes}>
          Ошибки: <strong>{mistakes}</strong> / {MAX_MISTAKES}
        </p>
      )}
      {isLost && (
        <p className={styles.memoryLost}>Попытки кончились</p>
      )}
      <div className={styles.memoryGrid}>
        {cards.map((card) => (
          <motion.button
            key={card.id}
            type="button"
            className={`${styles.memoryCard} ${isOpen(card.id) ? styles.memoryCardOpen : ''} ${isMatched(card.id) ? styles.memoryCardMatch : ''} ${isLost ? styles.memoryCardDisabled : ''}`}
            onClick={() => open(card.id)}
            disabled={phase !== 'play' || lock || isLost}
            initial={false}
            animate={{ scale: isMatched(card.id) ? 1.05 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <span className={styles.memoryFace}>{card.symbol}</span>
            <span className={styles.memoryBack}>?</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
