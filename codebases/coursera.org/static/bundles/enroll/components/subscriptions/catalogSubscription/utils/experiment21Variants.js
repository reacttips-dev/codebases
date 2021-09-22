import keysToConstants from 'js/lib/keysToConstants';

const exported = keysToConstants(['control', 'original', 'improved', 'hidden', 'reserved']);

export default exported;

export const { control, original, improved, hidden, reserved } = exported;
