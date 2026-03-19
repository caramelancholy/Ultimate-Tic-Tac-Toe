
export const ConnectionState = {
  INITIALISING: -1,
  DISCONNECTED: 0,
  CONNECTED: 1
} as const;

export const ConnectionActions = {
  MOVE: 0,
  REMATCH: 1,
  DISCONNECT: 2
} as const;

export type ConnectionState = typeof ConnectionState[keyof typeof ConnectionState];
export type ConnectionActions = typeof ConnectionActions[keyof typeof ConnectionActions];