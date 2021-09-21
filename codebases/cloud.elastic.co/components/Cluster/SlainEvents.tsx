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

import React, { Fragment, FunctionComponent } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

import {
  EuiCode,
  EuiFormHelpText,
  EuiFormLabel,
  EuiHorizontalRule,
  EuiListGroup,
  EuiListGroupItem,
  EuiSpacer,
} from '@elastic/eui'

import { CuiTimeAgo } from '../../cui'

import { ClusterSystemAlert } from '../../lib/api/v1/types'

type Props = {
  events: ClusterSystemAlert[]
}
const SlainEvents: FunctionComponent<Props> = ({ events }) => (
  <Fragment>
    <EuiHorizontalRule />
    <EuiSpacer size='s' />
    <EuiFormLabel>
      <FormattedMessage
        id='cluster-info.slain-nodes'
        defaultMessage='Automatically restarted nodes'
      />
    </EuiFormLabel>

    <EuiFormHelpText>
      <FormattedMessage
        id='cluster-info.slain-description'
        defaultMessage='Nodes are restarted automatically whenever the Elasticsearch process is killed. If you see
        that the same nodes are getting restarted repeatedly, you should investigate the cause. Usually this
        indicates that there might be a problem that needs to be corrected, such as a recurring out-of-memory
        condition when a cluster is too small to handle its workload.'
      />
    </EuiFormHelpText>

    <EuiSpacer size='m' />

    <EuiListGroup maxWidth={false} flush={true}>
      {events.map((event) => (
        <EuiListGroupItem
          key={event.timestamp}
          iconType='crosshairs'
          label={
            <Fragment>
              <FormattedMessage
                id='cluster-info.slain-node-details'
                defaultMessage='{instance} was restarted {when}'
                values={{
                  instance: event.instance_name,
                  when: <CuiTimeAgo date={moment(event.timestamp)} longTime={true} />,
                }}
              />
              {event.exit_code && ( // Exit code will never be 0, as 0 is not a slain event code.
                <Fragment>
                  {` `}
                  <FormattedMessage
                    id='cluster-info.slain-node-details.exit-code'
                    defaultMessage='with exit code: {code}'
                    values={{ code: <EuiCode>{event.exit_code}</EuiCode> }}
                  />
                </Fragment>
              )}
            </Fragment>
          }
        />
      ))}
    </EuiListGroup>
  </Fragment>
)

export default SlainEvents
