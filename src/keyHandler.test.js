import keyHandler, { IGNORED_KEYS } from './keyHandler';

describe('keyHandler', () => {
  describe('given key is pressed', () => {
    let keyStateMock;
    let handler;

    beforeEach(() => {
      keyStateMock = jest.fn();
      handler = keyHandler(keyStateMock);
    });

    it('sets pressed key correctly', () => {
      const eventStub = { key: 'A' };

      handler.keyDownHandler(eventStub);

      expect(keyStateMock).toHaveBeenCalled();
    });

    it('ignores modifier keys', () => {
      IGNORED_KEYS.forEach(key => handler.keyDownHandler({ key }));

      expect(keyStateMock).not.toHaveBeenCalled();
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
      ])
    })
    
  });
});
