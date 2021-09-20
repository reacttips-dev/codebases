import uuidv4 from 'uuid/v4';

let sessionId: string;

export const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = uuidv4();
  }

  return sessionId;
};
