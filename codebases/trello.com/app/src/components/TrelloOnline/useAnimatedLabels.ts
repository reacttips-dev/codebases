// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { LabelState } from 'app/scripts/view-models/label-state';
import { useEffect } from 'react';
import Backbone from '@trello/backbone';

let resetLabelTextAnimationTimer: number;

function resetLabelTextAnimation() {
  const $body = $('#trello-root');
  // add the non-animating class to keep label text showing, but the labels
  // don't reanimating when dragging cards, etc
  if (LabelState.getShowText()) {
    $body.addClass('body-card-label-text');
  }
  return $body
    .removeClass('body-card-label-text-on')
    .removeClass('body-card-label-text-off');
}

function toggleLabelText() {
  if (resetLabelTextAnimationTimer) {
    clearTimeout(resetLabelTextAnimationTimer);
  }

  // The class has to be on the body so it can apply to cards being dragged,
  // which are directly under the body in the DOM.

  if (LabelState.getShowText()) {
    $('#trello-root')
      .removeClass('body-card-label-text-off')
      .addClass('body-card-label-text-on');
  } else {
    // 'body-card-label-text' is the class present if the label text was
    // already showing on board load
    $('#trello-root')
      .removeClass('body-card-label-text-on body-card-label-text')
      // this class is necessary to be able to animate the label collapse:
      .addClass('body-card-label-text-off');
  }

  // Animation should be done in 660ms. Leave a bit of error margin.
  resetLabelTextAnimationTimer = window.setTimeout(
    resetLabelTextAnimation,
    1000,
  );
}

export const useAnimatedLabels = () => {
  useEffect(() => {
    if (LabelState.getShowText()) {
      $('#trello-root').addClass('body-card-label-text');
    }
    Backbone.Events.listenTo(LabelState, 'change:showText', toggleLabelText);

    return () => {
      Backbone.Events.stopListening(
        LabelState,
        'change:showText',
        toggleLabelText,
      );
    };
  }, []);
};
