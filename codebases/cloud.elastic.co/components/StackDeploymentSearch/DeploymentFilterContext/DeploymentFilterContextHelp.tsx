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

import React, { FunctionComponent, Fragment, ReactNode } from 'react'
import { FormattedMessage, defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiCode, EuiText, EuiSpacer } from '@elastic/eui'

import { CuiTable } from '../../../cui'

import { getSchema } from './schema'

type Props = WrappedComponentProps

type Field = {
  name: string | ReactNode
  example?: string
  exampleDescription?: ReactNode
  _always?: boolean
}

const messages = defineMessages({
  helpTitle: {
    id: `stack-deployment-filter-context-help.title`,
    defaultMessage: `Filtering deployments`,
  },
  filterNameColumn: {
    id: `stack-deployment-filter-context-help.filter-name-column`,
    defaultMessage: `Filter`,
  },
  filterExampleColumn: {
    id: `stack-deployment-filter-context-help.example-column`,
    defaultMessage: `Example`,
  },
  filterExampleDescriptionColumn: {
    id: `stack-deployment-filter-context-help.description-column`,
    defaultMessage: `Matches …`,
  },
})

export const helpTitle = messages.helpTitle

const DeploymentFilterContextHelp: FunctionComponent<Props> = ({ intl: { formatMessage } }) => {
  const schemaFields = Object.keys(getSchema().schema.fields)

  const everyField: Field[] = [
    {
      name: `id`,
      example: `id:decade0fc0de`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.id-example-description'
          defaultMessage='Deployments with the {idCode} ID'
          values={{
            idCode: <EuiCode>decade0fc0de</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `name`,
      example: `name:"my first deployment"`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.name-example-description'
          defaultMessage='Deployments named {name}'
          values={{
            name: <EuiCode>my first deployment</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `region`,
      example: `region:(us-east-1 or eu-west-1)`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.region-example-description'
          defaultMessage='Deployments in either {usEast} or {euWest}'
          values={{
            usEast: <EuiCode>us-east-1</EuiCode>,
            euWest: <EuiCode>eu-west-1</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `version`,
      example: `-version:6.4.0`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.version-example-description'
          defaultMessage='Deployments on a version other than { version }'
          values={{
            version: <EuiCode>6.4.0</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `configuration`,
      example: `configuration:aws.highio.classic`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.configuration-example-description'
          defaultMessage='Deployments using the {configuration} configuration'
          values={{
            configuration: <EuiCode>aws.highio.classic</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `healthy`,
      example: `healthy:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.healthy-example-description'
          defaultMessage='Healthy deployments'
        />
      ),
    },
    {
      name: `healthy_configuration`,
      example: `healthy_configuration:n`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.unhealthy-configuration-example-description'
          defaultMessage='Deployments with recent unsuccessful configuration changes'
        />
      ),
    },
    {
      name: `healthy_masters`,
      example: `healthy_masters:n`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.unhealthy-masters-example-description'
          defaultMessage='Deployments with unhealthy masters'
        />
      ),
    },
    {
      name: `healthy_shards`,
      example: `healthy_shards:n`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.unhealthy-shards-example-description'
          defaultMessage='Deployments with unhealthy shards'
        />
      ),
    },
    {
      name: `healthy_snapshot`,
      example: `healthy_snapshot:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.healthy-snapshot-example-description'
          defaultMessage='Deployments with a healthy snapshot'
        />
      ),
    },
    {
      name: `healthy_snapshot_latest`,
      example: `healthy_snapshot_latest:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.healthy-snapshot-latest-example-description'
          defaultMessage='Deployments that took their last snapshot successfully'
        />
      ),
    },
    {
      name: `enabled_snapshots`,
      example: `enabled_snapshots:n`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.enabled-snapshots-example-description'
          defaultMessage='Deployments that disabled snapshots'
        />
      ),
    },
    {
      name: `maintenance`,
      example: `maintenance:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.maintenance-example-description'
          defaultMessage='Deployments with instances in maintenance mode'
        />
      ),
    },
    {
      name: `locked`,
      example: `locked:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.locked-example-description'
          defaultMessage='Deployments locked out of user-initiated configuration changes'
        />
      ),
    },
    {
      name: `stopped`,
      example: `stopped:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.stopped-example-description'
          defaultMessage='Stopped deployments'
        />
      ),
    },
    {
      name: `pending`,
      example: `pending:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.pending-example-description'
          defaultMessage='Deployments with pending configuration changes'
        />
      ),
    },
    {
      name: `has`,
      example: `has:ml -has:kibana`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.has-example-description'
          defaultMessage='Deployments with Machine learning, and without Kibana'
        />
      ),
    },
    {
      name: `zones`,
      example: `zones>=2`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.zones-example-description'
          defaultMessage='Deployments spread across two or more zones'
        />
      ),
    },
    {
      name: `size`,
      example: `size>=32`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.size-example-description'
          defaultMessage='Deployments with at least 32 GB of RAM'
        />
      ),
    },
    {
      name: `hidden`,
      example: `hidden:n`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.hidden-example-description'
          defaultMessage='Deployments hidden from customers'
        />
      ),
    },
    {
      name: `organization`,
      example: `organization:1125421337`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.organization-example-description'
          defaultMessage='Deployments owned by {organizationId}'
          values={{
            organizationId: <EuiCode>1125421337</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `subscription`,
      example: `-subscription:standard`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.subscription-example-description'
          defaultMessage='Deployments owned by premium customers'
        />
      ),
    },
    {
      _always: true,
      name: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.free-form-example-description'
          defaultMessage='Free-form search'
        />
      ),
      example: `some query`,
      exampleDescription: schemaFields.includes(`region`) ? (
        <FormattedMessage
          id='stack-deployment-filter-context-help.free-example-description'
          defaultMessage='Deployments containing the terms {terms} somewhere in their ID, name, region, or version'
          values={{
            terms: <EuiCode>some query</EuiCode>,
          }}
        />
      ) : (
        <FormattedMessage
          id='stack-deployment-filter-context-help.free-example-description-no-region'
          defaultMessage='Deployments containing the terms {terms} somewhere in their ID, name, or version'
          values={{
            terms: <EuiCode>some query</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `system`,
      example: `system:y`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.system-example-description'
          defaultMessage='System-owned deployments'
        />
      ),
    },
    {
      name: `es`,
      example: `es:'metadata.system_owned:true AND metadata.hidden:false'`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.es-example-description'
          defaultMessage='Deployments matching the provided Lucene query terms'
        />
      ),
    },
    {
      name: `allocator`,
      example: `allocator:gi-3393989855090690498`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.allocator-example-description'
          defaultMessage='Deployments with instances on the {allocatorId} allocator'
          values={{
            allocatorId: <EuiCode>gi-3393989855090690498</EuiCode>,
          }}
        />
      ),
    },
    {
      name: `template`,
      example: `template:aws-hot-warm`,
      exampleDescription: (
        <FormattedMessage
          id='stack-deployment-filter-context-help.template-example-description'
          defaultMessage='Deployments based on the {specifiedTemplate} template'
          values={{
            specifiedTemplate: <EuiCode>aws-hot-warm</EuiCode>,
          }}
        />
      ),
    },
  ]

  const fields = everyField.filter(
    (field) =>
      field._always || (typeof field.name === `string` && schemaFields.includes(field.name)),
  )

  const nameColumn = {
    label: formatMessage(messages.filterNameColumn),
    render: ({ name }: Field) => (typeof name === `string` ? <EuiCode>{name}</EuiCode> : name),
    sortKey: `name`,
    width: `230px`,
  }

  const columns = [
    nameColumn,
    {
      label: formatMessage(messages.filterExampleColumn),
      render: ({ example }: Field) => <EuiCode>{example}</EuiCode>,
      width: `400px`,
    },
    {
      label: formatMessage(messages.filterExampleDescriptionColumn),
      render: ({ exampleDescription }: Field) => (
        <EuiText color='subdued' size='xs'>
          {exampleDescription}
        </EuiText>
      ),
    },
  ]

  return (
    <Fragment>
      <FormattedMessage
        id='stack-deployment-filter-context-help.description'
        defaultMessage='We offer a rich variety of deployment search filters, as detailed next.'
      />

      <EuiSpacer size='m' />

      <CuiTable
        rows={fields}
        columns={columns}
        initialSort={nameColumn}
        data-test-id='deploymentsHelpTable'
      />
    </Fragment>
  )
}

export default injectIntl(DeploymentFilterContextHelp)
