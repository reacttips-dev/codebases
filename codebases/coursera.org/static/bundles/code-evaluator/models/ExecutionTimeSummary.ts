import _ from 'lodash';

/**
 * We inject a random funny console message to keep the users happy.
 * @type {Array}
 */
const funnyMessages = [
  'Flying to the moon and back...',
  'Locating the required gigapixels to render...',
  'Spinning up the hamster...',
  'Shovelling coal into the server...',
  'Go ahead -- hold your breath...',
  "Don't think of purple hippos...",
  'A few bits tried to escape, but we caught them...',
  "We're testing your patience...",
  'First snow, then silence.\n\n This expensive server dies\n\n So beautifully.',
];

const messages = ['Uploading...', 'Compiling...', 'Setting up execution environment...', 'Executing...'];

class ExecutionTimeSummary {
  static slowExecutionThreshold = 5000;

  constructor({ max, median, p95 }: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'max' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
    this.max = max;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'median' does not exist on type 'Executio... Remove this comment to see the full error message
    this.median = median;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'p95' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
    this.p95 = p95;

    const postMessage = messages[3];
    const preMessages = messages.slice(0, 3);
    const funnyMessage = _.shuffle(funnyMessages).slice(1, 2);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'messages' does not exist on type 'Execut... Remove this comment to see the full error message
    this.messages = preMessages.concat([funnyMessage]).concat([postMessage]);
  }

  get duration() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'p95' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
    if (this.p95) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'p95' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
      return this.p95;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'median' does not exist on type 'Executio... Remove this comment to see the full error message
    } else if (this.median) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'median' does not exist on type 'Executio... Remove this comment to see the full error message
      return this.median;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'max' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
    } else if (this.max) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'max' does not exist on type 'ExecutionTi... Remove this comment to see the full error message
      return this.max;
    }

    return 0;
  }

  get isExecutionSlow() {
    const { slowExecutionThreshold } = ExecutionTimeSummary;

    if (this.duration) {
      return this.duration > slowExecutionThreshold;
    } else {
      return false;
    }
  }

  getPercent(timeInMs: $TSFixMe) {
    return Math.min((timeInMs / this.duration) * 100, 100);
  }

  getExecutionStep(timeInMs: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'messages' does not exist on type 'Execut... Remove this comment to see the full error message
    const index = Math.round((this.getPercent(timeInMs) * this.messages.length) / 100);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'messages' does not exist on type 'Execut... Remove this comment to see the full error message
    return this.messages[index] || this.messages[this.messages.length - 1];
  }
}

export default ExecutionTimeSummary;
