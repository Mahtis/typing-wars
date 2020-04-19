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
      movementHandler(e.key);
    }
    else if (!IGNORED_KEYS.includes(e.key)) {
      typingCallback(e.key);
    }
  };

  const movementHandler = key => {
    switch (key) {
      case 'ArrowUp':
        movementCallback.rotateWord();
        break;
      case 'ArrowDown':
        movementCallback.dropWord();
        break;
      case 'ArrowLeft':
        movementCallback.moveWordLeft();
        break;
      case 'ArrowRight':
        movementCallback.moveWordRight();
        break;
    }
  }

  return { keyDownHandler };
};

export default keyHandler;
