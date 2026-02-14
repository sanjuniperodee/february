import { useState, useCallback, useEffect } from 'react'
import Intro from './Intro'
import Hero from './Hero'
import FloatingHearts from './FloatingHearts'
import Timeline from './Timeline'
import GameOverlay from './GameOverlay'
import Checklist from './Checklist'
import WeatherNote from './WeatherNote'
import CalendarSection from './CalendarSection'
import MessageSection from './MessageSection'
import Footer from './Footer'
export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [unlocked, setUnlocked] = useState(() => new Set())
  const [gameEvent, setGameEvent] = useState(null)

  const handleUnlock = useCallback((id) => {
    setUnlocked((prev) => new Set(prev).add(id))
  }, [])

  const handlePlayGame = useCallback((event) => {
    setGameEvent(event)
  }, [])

  const handleCloseGame = useCallback(() => {
    setGameEvent(null)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('game-open', !!gameEvent)
    return () => document.body.classList.remove('game-open')
  }, [gameEvent])

  return (
    <>
      {!introDone && <Intro onComplete={() => setIntroDone(true)} />}
      <FloatingHearts />
      <Hero />
      <main id="main-content">
        <Timeline
          unlocked={unlocked}
          onUnlock={handleUnlock}
          onPlayGame={handlePlayGame}
        />
        <Checklist />
        <WeatherNote />
        <CalendarSection />
        <MessageSection />
        <Footer />
      </main>
      {gameEvent && (
        <GameOverlay
            event={gameEvent}
            onClose={handleCloseGame}
          onSuccess={handleUnlock}
        />
      )}
    </>
  )
}
