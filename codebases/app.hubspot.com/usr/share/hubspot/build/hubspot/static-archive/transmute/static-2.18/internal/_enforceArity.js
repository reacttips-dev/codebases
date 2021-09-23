'use es6';

export default function enforceArity(arity) {
  if (arity >= 0 && arity <= 9) {
    return arity;
  }

  throw new Error("expected `arity` from 0 to 9 but got `" + arity + "`");
}