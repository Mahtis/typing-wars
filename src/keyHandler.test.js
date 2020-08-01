import keyHandler, { IGNORED_KEYS } from './keyHandler';

describe('keyHandler', () => {
  let typingHandlerMock;
  let boardMovementHandlerStub;
  let handler;

  beforeEach(() => {
    typingHandlerMock = jest.fn();
    boardMovementHandlerStub = {
      rotateWord: jest.fn(),
      moveWordLeft: jest.fn(),
      moveWordRight: jest.fn(),
      dropWord: jest.fn()
    };
    handler = keyHandler();
  });

  describe('given a typing key is pressed', () => {
    let typingEventStub;

    beforeEach(() => {
      typingEventStub = { key: 'A', preventDefault: jest.fn() };

      handler.gameKeyHandler(
        typingHandlerMock,
        boardMovementHandlerStub
      )(typingEventStub);
    });

    it('calls pressed key correctly', () => {
      expect(typingHandlerMock).toHaveBeenCalled();
    });

    it('default event is prevented', () => {
      expect(typingEventStub.preventDefault).toHaveBeenCalled();
    });

    it('does not call any board movement handler', () => {
      expect(boardMovementHandlerStub.rotateWord).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.moveWordLeft).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.moveWordRight).not.toHaveBeenCalled();
      expect(boardMovementHandlerStub.dropWord).not.toHaveBeenCalled();
    });
  });

  it('ignores modifier keys', () => {
    IGNORED_KEYS.forEach(key =>
      handler.gameKeyHandler(
        typingHandlerMock,
        boardMovementHandlerStub
      )({ key, preventDefault: jest.fn() })
    );

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
    let gameKeyListener;

    beforeEach(() => {
      gameKeyListener = handler.gameKeyHandler(
        typingHandlerMock,
        boardMovementHandlerStub
      );
      rotateStub = { key: 'ArrowUp', preventDefault: jest.fn() };
      leftStub = { key: 'ArrowLeft', preventDefault: jest.fn() };
      rightStub = { key: 'ArrowRight', preventDefault: jest.fn() };
      dropStub = { key: 'ArrowDown', preventDefault: jest.fn() };
    });

    it('if event is up arrow, calls word rotation', () => {
      gameKeyListener(rotateStub);

      expect(boardMovementHandlerStub.rotateWord).toHaveBeenCalled();
    });

    it('if event is right arrow, calls moving word right', () => {
      gameKeyListener(rightStub);

      expect(boardMovementHandlerStub.moveWordRight).toHaveBeenCalled();
    });

    it('if event is left arrow, calls moving word left', () => {
      gameKeyListener(leftStub);

      expect(boardMovementHandlerStub.moveWordLeft).toHaveBeenCalled();
    });

    it('if event is down arrow, calls word drop', () => {
      gameKeyListener(dropStub);

      expect(boardMovementHandlerStub.dropWord).toHaveBeenCalled();
    });

    it('does not call the string match handler', () => {
      gameKeyListener(rotateStub);
      gameKeyListener(rightStub);
      gameKeyListener(leftStub);
      gameKeyListener(dropStub);

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

  describe('given readying key handler is used', () => {
    let readyKeyListener;
    let readyKeyCallbackMock;

    beforeEach(() => {
      readyKeyCallbackMock = jest.fn();

      readyKeyListener = handler.readyKeyHandler(readyKeyCallbackMock);
    });

    it('when enter is pressed, calls the ready callback', () => {
      readyKeyListener({ key: 'Enter', preventDefault: jest.fn() });

      expect(readyKeyCallbackMock).toHaveBeenCalled();
    })

    it('when space is pressed, calls the ready callback', () => {
      readyKeyListener({ key: ' ', preventDefault: jest.fn() });

      expect(readyKeyCallbackMock).toHaveBeenCalled();
    })

    it('when an unspecified kay is pressed, does not calls the ready callback', () => {
      readyKeyListener({ key: 'F', preventDefault: jest.fn() });

      expect(readyKeyCallbackMock).not.toHaveBeenCalled();
    })
    
  })
  
});
