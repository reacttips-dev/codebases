import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { closest, matches } from 'UIComponents/utils/Dom';
import { FINISH } from '../constants/TourActions';
import { EVENTS } from '../constants/TrackingConstants';
import { getAttachToElementQuery } from './attachToUtil';
import { debug } from './debugUtil';
import { getElement, listenToEventOnElement } from './elementUtil';
import { waitForAttachToElementToAppearOrFireSentry, waitForElementToAppear } from './mutationUtil';
import { setNextTourToStorage } from './tourStorage';
import { UsageTracker } from './usageTracker';
var attachedElements = [];
export var performActionAndRemoveListener = function performActionAndRemoveListener(tour, eventHandler, element, onEvent, interactionEvent) {
  // Tours can pass in a keyCode via the event value
  var _eventHandler$event$s = eventHandler.event.split(':'),
      _eventHandler$event$s2 = _slicedToArray(_eventHandler$event$s, 2),
      eventType = _eventHandler$event$s2[0],
      keyCode = _eventHandler$event$s2[1]; // If the keyCode exists then only trigger the action if the correct key is pressed


  if (keyCode && interactionEvent && interactionEvent.keyCode !== parseInt(keyCode, 10)) {
    return;
  }

  if (eventHandler.action && tour.getHandler().isActive) {
    tour[eventHandler.action]();
  } // Stop listening to future events


  element.removeEventListener(eventType, onEvent);
};

var handleEventListeners = function handleEventListeners(tour, step, attachToElement) {
  var eventHandlers = step.eventHandlers;

  if (!eventHandlers) {
    return;
  } // Listen out for events and progress the tour if they occur


  eventHandlers.forEach(function (eventHandler) {
    var contains = eventHandler.contains,
        elementGetter = eventHandler.elementGetter,
        elementQuery = eventHandler.elementQuery;
    var element = getElement({
      contains: contains,
      elementGetter: elementGetter,
      elementQuery: elementQuery
    }) || attachToElement;

    if (!element) {
      debug('No element for listening found');
      return;
    } // Certain elements in the CRM (ie communicator) cause multiple event attachments due to rendering/timing issues
    // In those cases, we prevent event handlers from being attached multiple times to a single element


    if (eventHandler.preventDuplicateListeners) {
      if (attachedElements.includes(element)) {
        return;
      }

      attachedElements.push(element);
    } // Tours can pass in a keyCode via the event value


    var _eventHandler$event$s3 = eventHandler.event.split(':'),
        _eventHandler$event$s4 = _slicedToArray(_eventHandler$event$s3, 1),
        eventType = _eventHandler$event$s4[0]; // Let the thread complete before listening. This prevents a parent node
    // click from triggering if its child is clicked and it is the next step.


    setTimeout(function () {
      // If the element is dynamic, we listen to events on the document that match the
      // element we're listening for. Once we get it, we stop listening on the document.
      if (eventHandler.isDynamic) {
        document.addEventListener(eventType, function onEvent(_ref) {
          var target = _ref.target;
          var currentElement = getElement({
            contains: contains,
            elementGetter: elementGetter,
            elementQuery: elementQuery
          });

          if (currentElement === target || // Check if the target would be selected by the provided elementQuery
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
          elementQuery && matches(target, elementQuery) || // Check if the target would be child element of the provided elementQuery
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
          // For example: UIButton will be rendered as:
          // <button>
          //   <i18n-string>...</i18n-string>
          // </button>
          // Event target of clicking on button may be i18n-string, closest will check if i18n-string is child of button and trigger tour action.
          elementQuery && closest(target, elementQuery)) {
            performActionAndRemoveListener(tour, eventHandler, document, onEvent);
          }
        });
      } else {
        element.addEventListener(eventType, function onEvent(interactionEvent) {
          performActionAndRemoveListener(tour, eventHandler, element, onEvent, interactionEvent);
        });
      }
    });
  });
};

var handleInteractions = function handleInteractions(tour, step, attachToElement) {
  handleEventListeners(tour, step, attachToElement);
};

export var beforeStepStartListener = function beforeStepStartListener(tour, step, completedStepsCount, linkedToursTotalStepCount, returnUrl) {
  // Set the tour id that should be shown on the next page if we hit the last step in the tour
  var _tour$getConfig = tour.getConfig(),
      steps = _tour$getConfig.steps,
      nextTourAlias = _tour$getConfig.nextTourAlias;

  var isOnLastStep = steps.indexOf(tour.getStep()) === steps.length - 1;
  var tourId = tour.getTour();
  var stepId = step.id;
  var attachToElementQuery = getAttachToElementQuery(step.attachTo);
  var attachToElement = getElement({
    elementGetter: step.attachTo && step.attachTo.elementGetter,
    elementQuery: attachToElementQuery
  });
  debug('Attaching to element: ', attachToElement);

  var handleStepShown = function handleStepShown() {
    UsageTracker.track(EVENTS.TOUR_VIEW_STEP, {
      attachToExists: !!attachToElement,
      stepId: stepId,
      tourId: tourId
    });

    if (isOnLastStep) {
      var hasFinishAction = Boolean((step.buttons || []).find(function (_ref2) {
        var action = _ref2.action;
        return action === FINISH;
      })); // Maybe mark action complete

      tour.getConfig().markTaskComplete({
        showTaskCompletionModal: !hasFinishAction
      });

      if (nextTourAlias) {
        setNextTourToStorage(nextTourAlias, tourId, completedStepsCount, linkedToursTotalStepCount, returnUrl);
      }
    }
  };

  if (step.isModal && !step.waitForElement) {
    handleStepShown();
  }

  if (!step.isModal && step.skippable && !attachToElement) {
    debug('Skipping tour step: ', stepId);
    tour.next();
    return Promise.resolve();
  }

  if (step.waitForElement) {
    var waitForElementPromise = typeof step.waitForElement === 'function' ? step.waitForElement() : waitForElementToAppear({
      elementQuery: step.waitForElement,
      requiresModalAnimation: step.attachTo && step.attachTo.requiresModalAnimation
    });
    return waitForElementPromise.then(function () {
      attachToElement = getElement({
        elementGetter: step.attachTo && step.attachTo.elementGetter,
        elementQuery: attachToElementQuery
      });
      handleStepShown();
      handleInteractions(tour, step, attachToElement);
    });
  } else if (!step.isModal) {
    return waitForAttachToElementToAppearOrFireSentry(tourId, stepId, {
      elementGetter: step.attachTo && step.attachTo.elementGetter,
      elementQuery: attachToElementQuery,
      requiresModalAnimation: step.attachTo && step.attachTo.requiresModalAnimation
    }).then(function (elementToAttachTo) {
      handleStepShown();
      handleInteractions(tour, step, elementToAttachTo);
    });
  }

  return Promise.resolve();
};

function attachEscapeHatchListener(escapeHatch, tour, completedStepsCount, linkedToursTotalStepCount, returnUrl) {
  escapeHatch.elementQueries.forEach(function (elementQuery) {
    listenToEventOnElement(elementQuery, escapeHatch.event, function () {
      if (escapeHatch.markComplete) {
        var _tour$getConfig2 = tour.getConfig(),
            steps = _tour$getConfig2.steps,
            nextTourAlias = _tour$getConfig2.nextTourAlias;

        var lastStepIdentifier = steps[steps.length - 1]; // If we hit a markComplete escape hatch, and there is a nextTourAlias, assume that the page is about
        // to immediately refresh. We don't want to display the next step, just allow the page do its thing.

        if (nextTourAlias) {
          setNextTourToStorage(nextTourAlias, tour.getTour(), completedStepsCount, linkedToursTotalStepCount, returnUrl);
        } else {
          tour.next(lastStepIdentifier);
        }
      } else {
        tour.deactivate();
      }
    });
  });
}

export function attachEscapeHatchListeners(tour, completedStepsCount, linkedToursTotalStepCount, returnUrl) {
  var _tour$getConfig3 = tour.getConfig(),
      escapeHatches = _tour$getConfig3.escapeHatches;

  if (escapeHatches) {
    escapeHatches.map(function (escapeHatch) {
      return attachEscapeHatchListener(escapeHatch, tour, completedStepsCount, linkedToursTotalStepCount, returnUrl);
    });
  }
}