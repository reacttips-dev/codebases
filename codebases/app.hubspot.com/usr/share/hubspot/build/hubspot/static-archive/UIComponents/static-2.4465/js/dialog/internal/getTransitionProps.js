'use es6';

export default function (onOpenStart, onOpenComplete, onCloseStart, onCloseComplete) {
  return {
    onOpenStart: onOpenStart,
    onOpenComplete: onOpenComplete,
    onCloseStart: onCloseStart,
    onCloseComplete: onCloseComplete
  };
}