export const IGNORED_KEYS = [
  'Shift',
  'Alt',
  'Meta',
  'Tab',
  'CapsLock',
  'Dead',
  'Control'
];

export const BOARD_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const keyHandler = (typingCallback, movementCallback) => {
  const keyDownHandler = e => {
    if (BOARD_KEYS.includes(e.key)) {
      movementCallback(e.key);
    }
    else if (!IGNORED_KEYS.includes(e.key)) {
      typingCallback(e.key);
    }
  };

  return { keyDownHandler };
};

export default keyHandler;
