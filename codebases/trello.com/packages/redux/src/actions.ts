const alphabet: string =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const randomString = (length: number): string => {
  const letters: string[] = [];

  while (letters.length < length) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return letters.join('');
};

const DEFAULT_TOKEN_SIZE = 12;

export interface Action<T, P> {
  id: string;
  type: T;
  payload: P;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function actionCreator<A extends Action<symbol, any>>(type: A['type']) {
  function creator(): Action<A['type'], null>;
  function creator(payload: A['payload']): A;
  function creator(
    payload?: A['payload'],
  ): Action<A['type'], A['payload'] | null> {
    return {
      // Uniquely identify an action.  This gets used by the sync process for
      // pending actions
      id: randomString(DEFAULT_TOKEN_SIZE),
      payload: typeof payload === 'undefined' ? null : payload,
      type,
    };
  }

  return creator;
}
