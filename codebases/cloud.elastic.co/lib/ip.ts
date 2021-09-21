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

import { Address4, Address6 } from 'ip-address'

export function checkIp(ipString: string): boolean {
  return isValidIpv4(ipString) || isValidIpv6(ipString)
}

function isValidIpv4(ipString: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new Address4(ipString) // blame the game
    return true
  } catch (err) {
    return false
  }
}

function isValidIpv6(ipString: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new Address6(ipString) // blame the game
    return true
  } catch (err) {
    return false
  }
}
