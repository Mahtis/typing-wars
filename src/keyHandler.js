
export const IGNORED_KEYS = [
  'Shift',
  'Alt',
  'Meta',
  'Tab',
  'CapsLock',
  'Dead',
  'Control'
]

const keyHandler = callback => {
  const keyDownHandler = e => {
    if (!IGNORED_KEYS.includes(e.key)) {
      callback(e.key)
    }
  }

  return { keyDownHandler }
}

export default keyHandler
