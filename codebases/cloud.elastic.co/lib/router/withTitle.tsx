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

import React, { Component, ComponentType } from 'react'
import { RouteComponentProps } from 'react-router'
import { injectIntl, WrappedComponentProps } from 'react-intl'

import { getDisplayName } from '../getDisplayName'

import { getConfigForKey } from '../../store'

type GetTitleFn = (props: { [key: string]: any }) => string | null

type Props = WrappedComponentProps & RouteComponentProps

export function withTitle<TestComponentProps = unknown>(
  WrappedComponent: ComponentType<TestComponentProps>,
  title: GetTitleFn | string | null,
) {
  class SetDocumentTitle extends Component<Props & TestComponentProps> {
    static displayName: string

    componentDidMount() {
      this.updateTitle()
    }

    componentDidUpdate() {
      this.updateTitle()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }

    updateTitle() {
      const baseTitle = typeof title === `function` ? title(this.props) : title
      const replacedTitle = replaceMatchParams(baseTitle, this.props)

      setDocumentTitle(replacedTitle)
    }
  }

  SetDocumentTitle.displayName = `withTitle(${getDisplayName(WrappedComponent)})`

  return injectIntl(SetDocumentTitle)
}

function replaceMatchParams(title: string | null, { match }: Props) {
  const routeParameterRegex = /:([A-Za-z]+)/g

  if (title === null) {
    return title
  }

  return title.replace(routeParameterRegex, routeParameterReplacer)

  function routeParameterReplacer(_all, paramName) {
    if (paramName in match.params) {
      return match.params[paramName]
    }

    return `:${paramName}`
  }
}

function getAppName() {
  if (getConfigForKey(`APP_NAME`) === `sku-picker`) {
    return `Elastic Cloud SKU Picker`
  }

  if (getConfigForKey(`APP_PLATFORM`) === `ece`) {
    return `Elastic Cloud Enterprise`
  }

  return `Elastic Cloud`
}

function setDocumentTitle(title: string | null) {
  document.title = title ? `${title} — ${getAppName()}` : getAppName()
}
