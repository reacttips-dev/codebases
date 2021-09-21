/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { AjaxRequestError, AsyncAction, ThunkDispatch } from '../types'

// Even though we might fail a request because it's unauthorized
// it's still important for us to allow the action, as we otherwise
// might end up with a state that's in a strange ... state.
// E.g. let's say we're fetching data, but the auth token is expired.
// We don't want to keep `isFetching = true`, but make sure the
// action is handled so `isFetching` is set to `false`.
const unauthorizedMiddleware =
  (unauthorized) =>
  (_store) =>
  (next: ThunkDispatch) =>
  (action: AsyncAction<any, AjaxRequestError>) => {
    if (
      action &&
      action.error &&
      action.payload instanceof AjaxRequestError &&
      action.payload.response !== undefined &&
      action.payload.response.status === 401 &&
      (action.meta == null || action.meta.handleUnauthorized !== true)
    ) {
      next(unauthorized(action.payload))
    }

    return next(action)
  }

export default unauthorizedMiddleware
