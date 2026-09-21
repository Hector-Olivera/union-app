import { isConversationUnread, shouldMarkAsRead } from '../messagingLogic';

describe('isConversationUnread', () => {
  it('devuelve true si mi UID está en unreadBy', () => {
    expect(isConversationUnread({ unreadBy: ['user1', 'user2'] }, 'user1')).toBe(true);
  });

  it('devuelve false si mi UID no está en unreadBy', () => {
    expect(isConversationUnread({ unreadBy: ['user2'] }, 'user1')).toBe(false);
  });

  it('devuelve false si unreadBy está vacío', () => {
    expect(isConversationUnread({ unreadBy: [] }, 'user1')).toBe(false);
  });

  it('devuelve false si unreadBy es undefined', () => {
    expect(isConversationUnread({ unreadBy: undefined }, 'user1')).toBe(false);
  });
});

describe('shouldMarkAsRead', () => {
  it('true solo si hay conversationId, currentUserId, y está en foco', () => {
    expect(shouldMarkAsRead('conv1', 'user1', true)).toBe(true);
  });

  it('false si la pantalla NO está en foco, aunque haya IDs válidos', () => {
    expect(shouldMarkAsRead('conv1', 'user1', false)).toBe(false);
  });

  it('false si falta conversationId', () => {
    expect(shouldMarkAsRead(undefined, 'user1', true)).toBe(false);
  });

  it('false si falta currentUserId', () => {
    expect(shouldMarkAsRead('conv1', undefined, true)).toBe(false);
  });
});