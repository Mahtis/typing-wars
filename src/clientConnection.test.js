import clientConnection, { dependencies } from './clientConnection';

describe('clientConnection', () => {
  describe('when initializing connection', () => {
    let connection;
    let socketMock;

    beforeEach(() => {
      window.history.replaceState({}, 'Test Title', '/room/someroom');

      socketMock = {
        emit: jest.fn(),
        on: jest.fn()
      };

      dependencies.io = () => socketMock;

      connection = clientConnection();
    });

    it('joins a room based on path', () => {
      connection.initConnection();

      expect(socketMock.emit).toHaveBeenCalledWith('joinroom', 'someroom');
    });


  });
});
