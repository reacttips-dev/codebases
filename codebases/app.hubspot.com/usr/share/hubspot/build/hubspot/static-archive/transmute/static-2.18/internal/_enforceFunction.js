'use es6';

export default function enforceFunction(operation, index) {
  if (typeof operation === 'function') {
    return operation;
  }

  var name = typeof index === 'number' ? "operation[" + index + "]" : 'operation';
  throw new Error("expected `" + name + "` to be a function but got `" + String(operation) + "`");
}