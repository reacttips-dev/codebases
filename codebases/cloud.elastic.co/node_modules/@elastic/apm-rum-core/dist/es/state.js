var __DEV__ = process.env.NODE_ENV !== 'production';

var state = {
  bootstrapTime: null,
  lastHiddenStart: Number.MIN_SAFE_INTEGER
};
export { __DEV__, state };