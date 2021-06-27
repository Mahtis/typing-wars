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

const keyHandler = () => {
  const gameKeyHandler = (
    typingCallback,
    { rotateWord, dropWord, moveWordLeft, moveWordRight }
  ) => e => {
    e.preventDefault();

    const movementHandler = key => {
      switch (key) {
        case 'ArrowUp':
          rotateWord();
          break;
        case 'ArrowDown':
          dropWord();
          break;
        case 'ArrowLeft':
          moveWordLeft();
          break;
        case 'ArrowRight':
          moveWordRight();
          break;
      }
    };

    if (BOARD_KEYS.includes(e.key)) {
      movementHandler(e.key);
    } else if (!IGNORED_KEYS.includes(e.key)) {
      typingCallback(e.key);
    }
  };

  const readyKeyHandler = readyCallback => e => {
    if (e.key === 'Enter' || e.key === ' ') {
      readyCallback();
    }
  };

  return { gameKeyHandler, readyKeyHandler };
};

export default keyHandler;
