export const IGNORED_KEYS = [
  'Shift',
  'Alt',
  'Meta',
  'Tab',
  'CapsLock',
  'Dead',
  'Control'
]

export const BOARD_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

const keyHandler = () => {
  const gameKeyHandler = (typingCallback, movementCallback) => e => {
    const movementHandler = key => {
      switch (key) {
        case 'ArrowUp':
          movementCallback.rotateWord()
          break
        case 'ArrowDown':
          movementCallback.dropWord()
          break
        case 'ArrowLeft':
          movementCallback.moveWordLeft()
          break
        case 'ArrowRight':
          movementCallback.moveWordRight()
          break
      }
    }

    if (BOARD_KEYS.includes(e.key)) {
      movementHandler(e.key)
    } else if (!IGNORED_KEYS.includes(e.key)) {
      typingCallback(e.key)
    }

  }

  const readyKeyHandler = readyCallback => e => {
    if (e.key === 'Enter' || e.key === ' ') {
      readyCallback()
    }
  }

  return { gameKeyHandler, readyKeyHandler }
}

export default keyHandler
