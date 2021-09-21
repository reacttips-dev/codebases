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

export const enter = 13
export const esc = 27
export const arrowUp = 38
export const arrowDown = 40

export const isKeyCode = (keyCode) => (e) => e.which === keyCode

export const isCommand = (e) => e.metaKey || e.ctrlKey

export const isCommandKeyCode = (keyCode) => {
  const matchesKeyCode = isKeyCode(keyCode)
  return (e) => isCommand(e) && matchesKeyCode(e)
}
