import { noop } from './utils'; // TYPES

// FUNCTIONS
var logger = console || {
  error: noop,
  warn: noop,
  log: noop
};
export function getLogger() {
  return logger;
}
export function setLogger(newLogger) {
  logger = newLogger;
}