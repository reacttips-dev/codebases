export enum BoardErrorExtensions {
  FREE_BOARD_LIMIT_REACHED = 'FREE_BOARD_LIMIT_REACHED',
}

export const BoardErrors: Record<string, BoardErrorExtensions> = {
  'Free boards limit exceeded': BoardErrorExtensions.FREE_BOARD_LIMIT_REACHED,
};
