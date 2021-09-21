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

import { SET_THEME } from '../../constants/actions'

import { getTheme, setTheme } from '../../lib/theme'
import { Action, Theme } from '../../types'

export type State = Theme

interface SetThemeAction extends Action<typeof SET_THEME> {
  theme: Theme
}

export default function themeReducer(state: State = getTheme(), action: SetThemeAction): State {
  if (action.type !== SET_THEME) {
    return state
  }

  const { theme } = action
  setTheme(theme)

  return theme
}
