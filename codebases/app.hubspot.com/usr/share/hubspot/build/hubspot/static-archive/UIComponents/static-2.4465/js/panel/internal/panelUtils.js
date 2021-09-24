'use es6';

export var getPanelTransitionProps = function getPanelTransitionProps(onOpenStart, onOpenComplete, onCloseStart, onCloseComplete, align, animate) {
  return {
    onOpenStart: onOpenStart,
    onOpenComplete: onOpenComplete,
    onCloseStart: onCloseStart,
    onCloseComplete: onCloseComplete,
    align: align,
    duration: animate ? undefined : 0
  };
};