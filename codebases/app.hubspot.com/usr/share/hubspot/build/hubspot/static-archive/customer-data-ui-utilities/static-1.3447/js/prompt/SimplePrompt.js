'use es6';

import Promptable from 'UIComponents/decorators/Promptable';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
/**
 * `SimplePrompt` is a useful wrapper around prompts that dont need to care
 * about the results of the Promptable promise, such as an informational
 * modal.
 *
 * It uses `rethrowError` to prevent the promise rejection from closing
 * the modal from throwing an exception.
 *
 * @param  {ReactComponent} BaseComponent
 * @return {function}
 */

export default function (ReactComponent) {
  var _prompt = Promptable(ReactComponent);

  return function (params) {
    _prompt(params).catch(rethrowError).done();
  };
}