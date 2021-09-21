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

import React, { ReactNode, Fragment, FunctionComponent } from 'react'

import { get } from 'lodash'

import { EuiCheckbox, EuiSpacer, EuiFormHelpText } from '@elastic/eui'

import { ElasticsearchClusterPlan } from '../../../../lib/api/v1/types'

type Props = {
  id: string
  label: ReactNode
  description: ReactNode
  help: ReactNode
  plan: ElasticsearchClusterPlan
  onChange: (path: string[], value: any) => void
  path: string[]
}

const PlanOverride: FunctionComponent<Props> = ({
  id,
  label,
  description,
  help,
  plan,
  onChange,
  path,
  children,
}) => {
  const checked = get(plan, path, false)

  return (
    <div>
      <EuiSpacer size='xs' />

      <EuiCheckbox
        id={id}
        label={
          <Fragment>
            <span>
              {label} — {description}
            </span>
            <EuiFormHelpText>{help}</EuiFormHelpText>

            {children}
          </Fragment>
        }
        checked={checked}
        onChange={() => onChange(path, !checked)}
      />
    </div>
  )
}

export default PlanOverride
