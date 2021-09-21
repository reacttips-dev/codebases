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

export function detectAdBlocker() {
  /* Inspired by 'https://www.npmjs.com/package/react-ad-block-detect' It
    creates a dummy element with classNames that are known to get flagged by
    adblockers. It then tests about whether or not the baitElement as been
    altered. */

  const baitElement = document.createElement('div')
  baitElement.className =
    'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads'
  baitElement.setAttribute(
    'style',
    'position: absolute; top: -10px; left: -10px; width: 1px; height: 1px;',
  )
  document.body.appendChild(baitElement)

  return (
    window.document.body.getAttribute('abp') != null ||
    baitElement.offsetParent === null ||
    baitElement.offsetHeight === 0 ||
    baitElement.offsetLeft === 0 ||
    baitElement.offsetTop === 0 ||
    baitElement.offsetWidth === 0 ||
    baitElement.clientHeight === 0 ||
    baitElement.clientWidth === 0
  )
}
