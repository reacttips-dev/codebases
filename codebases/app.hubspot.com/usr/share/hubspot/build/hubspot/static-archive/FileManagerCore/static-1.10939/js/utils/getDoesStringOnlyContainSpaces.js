'use es6';

export default function getDoesStringOnlyContainSpaces(name) {
  return !!name.length && !name.trim().length;
}