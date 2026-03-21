
export const ConnectionState = {
  INITIALISING: -1,
  DISCONNECTED: 0,
  CONNECTED: 1
} as const;

export const ConnectionAction = {
  MOVE: 0,
  REMATCH: 1,
  DISCONNECT: 2
} as const;

export const ConnectionSource = {
  LOCAL: 0,
  REMOTE: 1
} as const;

export type ConnectionState = typeof ConnectionState[keyof typeof ConnectionState];
export type ConnectionAction = typeof ConnectionAction[keyof typeof ConnectionAction];
export type ConnectionSource = typeof ConnectionSource[keyof typeof ConnectionSource];

export type ConnectionData = {
  action: ConnectionAction
  command: Record<string, string | number>
}