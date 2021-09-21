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

// Based on https://github.com/sindresorhus/linkify-urls

import React, { ReactElement } from 'react'
import ExternalLink from '../components/ExternalLink'

const urlRegex =
  /((?:https?(?::\/\/))(?:www\.)?[a-zA-Z0-9-_.]+(?:\.[a-zA-Z0-9]{2,})(?:[-a-zA-Z0-9:%_+.~#?&//=@]*))/g

const linkify = (input: string) =>
  input.split(urlRegex).reduce((result, text, index) => {
    if (index % 2) {
      // URLs are always in odd positions
      result.push(
        <ExternalLink key={index} href={text}>
          {text}
        </ExternalLink>,
      )
    } else if (text.length > 0) {
      result.push(text)
    }

    return result
  }, [] as Array<string | ReactElement<typeof ExternalLink>>)

export default linkify
