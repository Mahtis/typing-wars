import clientConnection, { dependencies } from './clientConnection';

describe('clientConnection', () => {
  describe('when initializing connection', () => {
    let connection;
    let socketMock;
    let addWordMock;

    beforeEach(() => {
      window.history.replaceState({}, 'Test Title', '/room/someroom');

      socketMock = {
        emit: jest.fn(),
        on: jest.fn()
      };

      addWordMock = jest.fn();

      dependencies.io = () => socketMock;

      connection = clientConnection(addWordMock);

      connection.initConnection();
    });

    it('joins a room based on path', () => {
      expect(socketMock.emit).toHaveBeenCalledWith('joinroom', 'someroom');
    });

    describe('given sending a message', () => {
      beforeEach(() => {
        connection.sendMessage('word');
      });

      it('emits message with msg header', () => {
        expect(socketMock.emit).toHaveBeenCalledWith('msg', 'word')
      })
    })
    
    describe('given sending the word board', () => {
      beforeEach(() => {
        connection.sendBoard([
          '      some',
          '   board  ',
          'with      ',
          '  words   ']);
      });

      it('emits board with board header', () => {
        expect(socketMock.emit).toHaveBeenCalledWith('board', [
          '      some',
          '   board  ',
          'with      ',
          '  words   '])
      })
    })

    // TODO: Invent a way to test that socket.on() works,
    // or should it be abstracted even further?
  });
});
