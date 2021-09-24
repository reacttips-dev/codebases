'use es6';

var scrollTimeout = null;

function scrollElementTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 150;
  var currentTime = 0;
  var timeIncrement = 20;
  var start = element.scrollTop;
  var change = to - start;

  var animateScroll = function animateScroll() {
    currentTime += timeIncrement;
    element.scrollTop = start + currentTime / duration * change;

    if (currentTime < duration) {
      scrollTimeout = setTimeout(animateScroll, timeIncrement);
    } else {
      element.scrollTop = to;
    }
  };

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }

  animateScroll();
}

export function scrollToStep(stepIndex, steps) {
  if (!steps) {
    return;
  }

  var destination = steps.querySelectorAll(".step-editor-container[data-step-order=\"" + stepIndex + "\"]")[0];

  if (!destination) {
    return;
  }

  var REQUIRED_PADDING = 153;
  scrollElementTo(steps, destination.offsetTop - REQUIRED_PADDING);
}