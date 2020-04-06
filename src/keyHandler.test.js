import keyHandler, { IGNORED_KEYS } from './keyHandler';

describe('keyHandler', () => {
  let typingHandlerMock;
  let boardMovementHandlerMock;
  let handler;

  beforeEach(() => {
    typingHandlerMock = jest.fn();
    boardMovementHandlerMock = jest.fn();
    handler = keyHandler(typingHandlerMock, boardMovementHandlerMock);
  });

  describe('given a typing key is pressed', () => {
    let typingEventStub;

    beforeEach(() => {
      typingEventStub = { key: 'A' };

      handler.keyDownHandler(typingEventStub);
    });

    it('calls pressed key correctly', () => {
      expect(typingHandlerMock).toHaveBeenCalled();
    });

    it('does not call the board movement handler', () => {
      expect(boardMovementHandlerMock).not.toHaveBeenCalled();
    });
  });

  it('ignores modifier keys', () => {
    IGNORED_KEYS.forEach(key => handler.keyDownHandler({ key }));

    expect(typingHandlerMock).not.toHaveBeenCalled();
    expect(boardMovementHandlerMock).not.toHaveBeenCalled();
  });

  describe('given movement control key is pressed', () => {
    let movementEventStub;

    beforeEach(() => {
      movementEventStub = { key: 'ArrowUp' };

      handler.keyDownHandler(movementEventStub);
    });

    it('calls board movement callback', () => {
      expect(boardMovementHandlerMock).toHaveBeenCalledWith('ArrowUp');
    });

    it('does not call the string match handler', () => {
      expect(typingHandlerMock).not.toHaveBeenCalled();
    });
  });

  it('ignores correct set of keys', () => {
    expect(IGNORED_KEYS).toEqual([
      'Shift',
      'Alt',
      'Meta',
      'Tab',
      'CapsLock',
      'Dead',
      'Control'
    ]);
  });
});
