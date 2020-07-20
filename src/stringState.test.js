import stringState from './stringState';

describe('stringState', () => {
  let state;
  let wordlistStub;
  let connectionStub;
  let scoreUpdateStub;

  beforeEach(() => {
    wordlistStub = ['eka', 'toka', 'kolmas'];
    connectionStub = { sendMessage: jest.fn() };
    scoreUpdateStub = jest.fn();
    state = stringState(wordlistStub, connectionStub, scoreUpdateStub);
  });

  it('updates current string correctly', () => {
    state.updateString('D');

    expect(state.getCurrentString()).toBe('D');
  });

  describe('given the key is a terminator', () => {
    describe('if the current string does not match last word on the list', () => {
      beforeEach(() => {
        state.updateString('toka');
        state.updateString(' ');
      });

      it('word list does not change', () => {
        expect(state.getWordList().length).toBe(3);
        expect(state.getWordList()[2]).toBe('kolmas');
      });

      it('does not send a message of word completion', () => {
        expect(connectionStub.sendMessage).not.toHaveBeenCalled();
      });

      it('calls for score update with false', () => {
        expect(scoreUpdateStub).toHaveBeenCalledWith(false);
      });
    });

    describe('if the current string matches last word on the list', () => {
      beforeEach(() => {
        state.updateString('kolmas');
        state.updateString(' ');
      });

      it('word list is shortened by one', () => {
        expect(state.getWordList().length).toBe(2);
        expect(state.getWordList()[1]).toBe('toka');
      });

      it('the word is added to completed words', () => {
        expect(state.getCompletedWords()[0]).toBe('kolmas');
      });

      it('sends a message of word completion', () => {
        expect(connectionStub.sendMessage).toHaveBeenCalledWith('kolmas');
      });

      it('calls for score update with true and the word', () => {
        expect(scoreUpdateStub).toHaveBeenCalledWith(true, 'kolmas');
      });
    });

    fdescribe('given the string matches a word on skip list', () => {
      beforeEach(() => {
        state.updateString('PASS');
        state.updateString(' ');
      });

      it('removes the last word from the main word list', () => {
        expect(state.getWordList().length).toBe(2);
        expect(state.getWordList()[1]).toBe('toka');
      });

      it('removes the last word from the skip list', () => {
        expect(state.getSkipList().length).toBe(2);
        expect(state.getSkipList()[1]).toBe('PASS');
      });
    });
    

    it('if the key is space, sets string back to empty', () => {
      state.updateString('D');
      state.updateString(' ');

      expect(state.getCurrentString()).toBe('');
    });

    it('if the key is enter, sets string back to empty', () => {
      state.updateString('D');
      state.updateString('Enter');

      expect(state.getCurrentString()).toBe('');
    });
  });

  it('if the key is backspace, deletes character from the end', () => {
    state.updateString('A');
    state.updateString('B');
    state.updateString('Backspace');

    expect(state.getCurrentString()).toBe('A');
  });
});
