import { useEffect, useMemo, useState, useRef } from 'react'
import styles from './Games.module.css'

const GRID = 8
const SHAPES = [
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 0], [1, 0]],
  [[1, 1], [0, 1], [0, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1], [0, 1]],
]

function randomShape() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  return shape.map((row) => [...row])
}

function rotateRight(shape) {
  const rows = shape.length
  const cols = shape[0].length
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c]
    }
  }
  return rotated
}

function canPlaceAt(grid, shape, startRow, startCol) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (!shape[r][c]) continue
      const rr = startRow + r
      const cc = startCol + c
      if (rr < 0 || rr >= GRID || cc < 0 || cc >= GRID) return false
      if (grid[rr][cc]) return false
    }
  }
  return true
}

function hasAnyPlacement(grid, shape) {
  for (let row = 0; row <= GRID - shape.length; row++) {
    for (let col = 0; col <= GRID - shape[0].length; col++) {
      if (canPlaceAt(grid, shape, row, col)) return true
    }
  }
  return false
}

export default function GameBlockBlast({ goal = 5, onWin, onProgress }) {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID }, () => Array(GRID).fill(0)),
  )
  const [shape, setShape] = useState(randomShape)
  const [clearedLines, setClearedLines] = useState(0)
  const [invalidPulse, setInvalidPulse] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [ghostPlace, setGhostPlace] = useState(null)

  useEffect(() => {
    onProgress?.(clearedLines, goal, 'Линий')
    if (clearedLines >= goal) {
      const timer = setTimeout(() => onWin?.(), 350)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [clearedLines, goal, onProgress, onWin])

  const shapePreview = useMemo(() => shape, [shape])
  const dragImageRef = useRef(null)

  useEffect(() => {
    const sz = 18
    const gap = 2
    const rows = shape.length
    const cols = shape[0].length
    const w = cols * sz + (cols - 1) * gap
    const h = rows * sz + (rows - 1) * gap
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!shape[r][c]) continue
        const x = c * (sz + gap)
        const y = r * (sz + gap)
        const g = ctx.createLinearGradient(x, y, x + sz, y + sz)
        g.addColorStop(0, '#e8bfd2')
        g.addColorStop(1, '#c687a5')
        ctx.fillStyle = g
        ctx.fillRect(x, y, sz, sz)
      }
    }
    const img = new Image()
    img.onload = () => { dragImageRef.current = img }
    img.src = canvas.toDataURL('image/png')
    return () => { dragImageRef.current = null }
  }, [shape])

  const tryPlace = (row, col) => {
    if (isGameOver) return
    if (!canPlaceAt(grid, shape, row, col)) {
      setInvalidPulse(true)
      setTimeout(() => setInvalidPulse(false), 220)
      return
    }

    const next = grid.map((line) => [...line])
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c]) next[row + r][col + c] = 1
      }
    }

    const rowsToClear = []
    const colsToClear = []
    for (let r = 0; r < GRID; r++) {
      if (next[r].every((v) => v === 1)) rowsToClear.push(r)
    }
    for (let c = 0; c < GRID; c++) {
      if (next.every((line) => line[c] === 1)) colsToClear.push(c)
    }
    rowsToClear.forEach((r) => next[r].fill(0))
    colsToClear.forEach((c) => {
      for (let r = 0; r < GRID; r++) next[r][c] = 0
    })

    const gained = rowsToClear.length + colsToClear.length
    if (gained > 0) setClearedLines((value) => value + gained)

    const nextShape = randomShape()
    setGrid(next)
    setShape(nextShape)

    if (!hasAnyPlacement(next, nextShape)) {
      setIsGameOver(true)
    }
  }

  const restart = () => {
    setGrid(Array.from({ length: GRID }, () => Array(GRID).fill(0)))
    setShape(randomShape())
    setClearedLines(0)
    setIsGameOver(false)
    setInvalidPulse(false)
  }

  const gridRef = useRef(null)
  const PADDING = 6


  const findDropCell = (clientX, clientY) => {
    if (!gridRef.current) return null
    const rect = gridRef.current.getBoundingClientRect()
    const innerW = rect.width - PADDING * 2
    const innerH = rect.height - PADDING * 2
    const cellW = innerW / GRID
    const cellH = innerH / GRID
    const x = clientX - rect.left - PADDING
    const y = clientY - rect.top - PADDING
    let col = Math.floor(x / cellW)
    let row = Math.floor(y / cellH)
    col = Math.max(0, Math.min(col, GRID - 1))
    row = Math.max(0, Math.min(row, GRID - 1))
    return { row, col }
  }

  const getPlaceAtCursor = (clientX, clientY) => {
    const pos = findDropCell(clientX, clientY)
    if (!pos) return null
    const rows = shape.length
    const cols = shape[0].length
    const maxRow = GRID - rows
    const maxCol = GRID - cols
    let baseRow = Math.max(0, Math.min(pos.row, maxRow))
    let baseCol = Math.max(0, Math.min(pos.col, maxCol))
    if (canPlaceAt(grid, shape, baseRow, baseCol)) return { row: baseRow, col: baseCol }
    const order = [
      [0, 0], [0, -1], [0, 1], [-1, 0], [1, 0],
      [-1, -1], [-1, 1], [1, -1], [1, 1], [0, -2], [0, 2], [-2, 0], [2, 0],
    ]
    for (const [dr, dc] of order) {
      const r = baseRow + dr
      const c = baseCol + dc
      if (r >= 0 && r <= maxRow && c >= 0 && c <= maxCol && canPlaceAt(grid, shape, r, c)) {
        return { row: r, col: c }
      }
    }
    return null
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const place = getPlaceAtCursor(e.clientX, e.clientY)
    setGhostPlace(place)
  }

  const handleDragLeave = () => {
    setGhostPlace(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setGhostPlace(null)
    if (isGameOver || !gridRef.current) return
    const pos = findDropCell(e.clientX, e.clientY)
    if (!pos) return
    const rows = shape.length
    const cols = shape[0].length
    const maxRow = GRID - rows
    const maxCol = GRID - cols
    let baseRow = Math.max(0, Math.min(pos.row, maxRow))
    let baseCol = Math.max(0, Math.min(pos.col, maxCol))
    if (canPlaceAt(grid, shape, baseRow, baseCol)) {
      tryPlace(baseRow, baseCol)
      return
    }
    const order = [
      [0, 0], [0, -1], [0, 1], [-1, 0], [1, 0],
      [-1, -1], [-1, 1], [1, -1], [1, 1], [0, -2], [0, 2], [-2, 0], [2, 0],
    ]
    for (const [dr, dc] of order) {
      const r = baseRow + dr
      const c = baseCol + dc
      if (r >= 0 && r <= maxRow && c >= 0 && c <= maxCol && canPlaceAt(grid, shape, r, c)) {
        tryPlace(r, c)
        return
      }
    }
    setInvalidPulse(true)
    setTimeout(() => setInvalidPulse(false), 220)
  }

  return (
    <div className={styles.blockBlastWrap}>
      <div className={styles.blockGridOuter}>
        <div
          ref={gridRef}
          className={`${styles.blockGrid} ${invalidPulse ? styles.invalidPulse : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {grid.map((line, row) =>
            line.map((cell, col) => (
              <button
                key={`${row}-${col}`}
                type="button"
                className={`${styles.blockCell} ${cell ? styles.blockCellFilled : ''}`}
                onClick={() => tryPlace(row, col)}
              />
            )),
          )}
        </div>
        {ghostPlace && (
          <div className={styles.blockGridGhost} aria-hidden>
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const row = Math.floor(i / GRID)
              const col = i % GRID
              const r = row - ghostPlace.row
              const c = col - ghostPlace.col
              const inShape = r >= 0 && r < shape.length && c >= 0 && c < shape[0].length && shape[r][c]
              return (
                <div
                  key={i}
                  className={inShape ? styles.blockCellGhost : ''}
                />
              )
            })}
          </div>
        )}
      </div>

      <div className={styles.blockControls}>
        <button
          type="button"
          className={styles.gameBtn}
          onClick={() => setShape((prev) => rotateRight(prev))}
        >
          Повернуть
        </button>
        <button type="button" className={styles.gameBtnGhost} onClick={restart}>
          Сбросить
        </button>
      </div>

      <p className={styles.blastLabel}>Перетащи фигуру на сетку или кликни по клетке</p>
      <div
        className={styles.blockShape}
        style={{ '--rows': shapePreview.length, '--cols': shapePreview[0].length }}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', 'shape')
          e.dataTransfer.effectAllowed = 'move'
          const rows = shape.length
          const cols = shape[0].length
          const rect = e.currentTarget.getBoundingClientRect()
          const ox = Math.min(Math.max(0, e.clientX - rect.left), Math.max(0, cols * 20 - 4))
          const oy = Math.min(Math.max(0, e.clientY - rect.top), Math.max(0, rows * 20 - 4))
          const img = dragImageRef.current
          if (img && img.complete && img.naturalWidth) {
            e.dataTransfer.setDragImage(img, ox, oy)
          } else {
            const dragWrap = document.createElement('div')
            dragWrap.setAttribute('data-drag-shape', '1')
            dragWrap.style.cssText = 'position:fixed;left:0;top:0;display:grid;grid-template-columns:repeat(' + cols + ',18px);grid-template-rows:repeat(' + rows + ',18px);gap:2px;background:transparent;pointer-events:none;z-index:9999;opacity:0.001;'
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const cell = document.createElement('span')
                if (shape[r][c]) {
                  cell.style.cssText = 'width:18px;height:18px;border-radius:3px;background:linear-gradient(145deg,#e8bfd2 0%,#c687a5 100%);'
                } else {
                  cell.style.cssText = 'width:18px;height:18px;background:transparent;'
                }
                dragWrap.appendChild(cell)
              }
            }
            document.body.appendChild(dragWrap)
            void dragWrap.offsetHeight
            e.dataTransfer.setDragImage(dragWrap, ox, oy)
            requestAnimationFrame(() => dragWrap.remove())
          }
        }}
        onDragEnd={() => {
          setGhostPlace(null)
          document.querySelector('[data-drag-shape="1"]')?.remove()
        }}
      >
        {shapePreview.map((line, r) =>
          line.map((cell, c) => (
            <span
              key={`${r}-${c}`}
              className={`${styles.blockShapeCell} ${cell ? styles.blockShapeCellOn : ''}`}
            />
          )),
        )}
      </div>

      {isGameOver && (
        <div className={styles.inlineGameOver}>
          <p>Некуда поставить фигуру. Нажми "Сбросить".</p>
        </div>
      )}
    </div>
  )
}
