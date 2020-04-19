import keyHandler, { IGNORED_KEYS } from './keyHandler';

describe('keyHandler', () => {
  let typingHandlerMock;
  let boardMovementHandlerStub;
  let handler;

  beforeEach(() => {
    typingHandlerMock = jest.fn();
    boardMovementHandlerStub = { rotateWord: jest.fn(), moveWordLeft: jest.fn(), moveWordRight: jest.fn(), dropWord: jest.fn() };
    handler = keyHandler(typingHandlerMock, boardMovementHandlerStub);
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

    it('does not call any board movement handler', () => {
      expect(boardMovementHandlerStub.rotateWord).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.moveWordLeft).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.moveWordRight).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.dropWord).not.toHaveBeenCalled();
    });
  });

  it('ignores modifier keys', () => {
    IGNORED_KEYS.forEach(key => handler.keyDownHandler({ key }));

    expect(typingHandlerMock).not.toHaveBeenCalled();
    expect(boardMovementHandlerStub.rotateWord).not.toHaveBeenCalled();
    expect(boardMovementHandlerStub.moveWordLeft).not.toHaveBeenCalled();
    expect(boardMovementHandlerStub.moveWordRight).not.toHaveBeenCalled();
    expect(boardMovementHandlerStub.dropWord).not.toHaveBeenCalled();
  });

  describe('given movement control key is pressed', () => {
    let rotateStub;
    let leftStub;
    let rightStub;
    let dropStub;

    beforeEach(() => {
      rotateStub = { key: 'ArrowUp' };
      leftStub = { key: 'ArrowLeft' };
      rightStub = { key: 'ArrowRight' };
      dropStub = { key: 'ArrowDown' };
    });

    it('if event is up arrow, calls word rotation', () => {
      handler.keyDownHandler(rotateStub);

      expect(boardMovementHandlerStub.rotateWord).toHaveBeenCalled();
    });

    it('if event is right arrow, calls moving word right', () => {
      handler.keyDownHandler(rightStub);

      expect(boardMovementHandlerStub.moveWordRight).toHaveBeenCalled();
    });

    it('if event is left arrow, calls moving word left', () => {
      handler.keyDownHandler(leftStub);

      expect(boardMovementHandlerStub.moveWordLeft).toHaveBeenCalled();
    });

    it('if event is down arrow, calls word drop', () => {
      handler.keyDownHandler(dropStub);

      expect(boardMovementHandlerStub.dropWord).toHaveBeenCalled();
    });

    it('does not call the string match handler', () => {
      handler.keyDownHandler(rotateStub);
      handler.keyDownHandler(rightStub);
      handler.keyDownHandler(leftStub);
      handler.keyDownHandler(dropStub);

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
