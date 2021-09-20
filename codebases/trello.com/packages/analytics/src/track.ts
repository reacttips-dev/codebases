import { appContext } from './appContext';
import { Noun, Schema, Verb } from './constants';
import { log } from './log';
import { UnstructuredEvent, EventContext } from './types';
import { trackGTMEvent } from './googleTagManager';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debouncer<T extends (...args: any[]) => void>(fx: T) {
  const lastRuns: Map<string, number> = new Map();

  return (interval: number): T => {
    return ((...args: unknown[]) => {
      const key = JSON.stringify(args);
      const lastRun = lastRuns.get(key);
      const now = Date.now();

      if (lastRun === undefined || now - lastRun >= interval) {
        lastRuns.set(key, now);
        fx(...args);

        setTimeout(() => {
          if (lastRuns.get(key) === now) {
            lastRuns.delete(key);
          }
        }, interval);
      }
    }) as T;
  };
}

/**
 * NOTE on `window.sp`:
 * Deep down in the guts of Snowplow during window.sp, it asks for
 * the document.offsetWidth which causes the browser to repaint. It
 * does this for every single tracking event - and can cause 100+ms
 * thread lockups when trackUE is called. Due to this, wrapping the
 * call to window.sp in a setTimeout to improve UI performance.
 */

/**
 * Track a StructuredEvent. Added for backwards compatibility with classic
 * snowplow events.
 */
export const track = (
  category: string,
  action: string,
  label?: string,
  propertyOrValue?: string | number,
  optValue?: number,
) => {
  const property: string | undefined =
    typeof propertyOrValue === 'string' ? propertyOrValue : undefined;
  const value: number | undefined =
    typeof propertyOrValue === 'number' ? propertyOrValue : optValue;

  if (window.ga) {
    window.ga!('send', 'event', category, action, label, value);
  }

  if (window.sp) {
    setTimeout(() => {
      window.sp!(
        'trackStructEvent:cf',
        category,
        action,
        label,
        property,
        value,
        appContext,
      );
    });
  }

  trackGTMEvent({
    event: 'snowplow.event',
    snowplowEvent: {
      context: appContext,
      category,
      action,
      label,
      property,
      value,
    },
  });

  log({
    category,
    action,
    label,
    property,
    value: value !== undefined ? `${value}` : undefined,
  });
};

export const trackDebounced = {
  // eslint-disable-next-line @trello/no-module-logic
  day: debouncer(track)(24 * 60 * 60 * 1000),
  // eslint-disable-next-line @trello/no-module-logic
  hour: debouncer(track)(60 * 60 * 1000),
};

const MAX_CONTEXT_LENGTH = 255;

/**
 * Method used to track unstructured events.
 *
 * Please see the following url if you have questions related to how to
 * properly create an event:
 * http://go.atlassian.com/trello-event-tracking-intro
 */
export const trackUe = (
  ueOrCategory: UnstructuredEvent | Noun,
  verb?: Verb,
  directObj?: Noun,
  prepositionalObj?: string,
  indirectObj?: string,
  method?: string,
  context?: EventContext | string,
): void => {
  if (!window.sp) {
    return;
  }

  // Accept a fully formed UE or individual string params in order
  // to work with both Gamma and Classic's original implementations
  let event: UnstructuredEvent;
  if (typeof ueOrCategory === 'string' && !!verb && !!directObj) {
    event = {
      category: ueOrCategory,
      verb,
      directObj,
      prepositionalObj,
      indirectObj,
      method,
      context,
    };
  } else {
    event = ueOrCategory as UnstructuredEvent;
  }

  let contextString: string = '';
  if (typeof event.context === 'string') {
    contextString = event.context;
  } else if (
    event.context &&
    event.context.toString === Object.prototype.toString
  ) {
    contextString = JSON.stringify(event.context);
  }

  if (
    process.env.NODE_ENV === 'development' &&
    contextString.length > MAX_CONTEXT_LENGTH
  ) {
    console.warn(
      `Stringified context for event with category "${event.category}" was ${contextString.length} chacters, but will be truncated to ${MAX_CONTEXT_LENGTH} characters`,
    );
  }

  setTimeout(() => {
    window.sp!(
      'trackUnstructEvent:cf',
      {
        schema: Schema.ClientEvent,
        data: {
          ue_category: event.category,
          ue_verb: event.verb,
          ue_dir_object: event.directObj,
          ue_prep_object: event.prepositionalObj || '',
          ue_ind_object: event.indirectObj || '',
          ue_method: event.method || '',
          ue_context: contextString || '',
        },
      },
      appContext,
    );

    log({ ...event, context: contextString });
  });
};

/**
 * Track pageviews to google analytics and to snowplow
 */
export const trackPageview = (fragment: string): void => {
  if (window.ga) {
    window.ga('send', 'pageview', fragment);
  }

  if (window.sp) {
    setTimeout(() => {
      window.sp!('trackPageView:cf', null, appContext);
    });
  }
};

/**
 * Track an experiment
 */
export const trackExperiment = (
  experimentId: string,
  variationId: string | undefined,
  assignmentId: string,
) => {
  if (!window.sp) {
    return;
  }

  setTimeout(() => {
    window.sp!('trackUnstructEvent:cf', {
      schema: Schema.ExperimentEvent,
      data: {
        experiment_id: experimentId,
        variation_id: variationId,
        assignment_id: assignmentId,
      },
    });

    log({ experimentId, variationId, assignmentId });
  });
};
