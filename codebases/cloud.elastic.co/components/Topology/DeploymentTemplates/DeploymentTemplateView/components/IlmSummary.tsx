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

import React, { Component, Fragment } from 'react'
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { isEmpty, sortBy } from 'lodash'

import {
  EuiBadge,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'
import NodeAttributeTags from '../../../IndexLifecycleManagement/NodeAttributeTags'
import { extractInstanceTemplateConfigFieldsForEs } from '../../../../../lib/deploymentTemplates/deploymentTemplate'
import { getInstanceConfigurationById } from '../../../../../lib/instanceConfigurations/instanceConfiguration'
import { InstanceConfiguration } from '../../../../../lib/api/v1/types'

import '../deploymentTemplateView.scss'

type Props = {
  intl: IntlShape
  data: any
  title?: JSX.Element
  instanceConfigurations: InstanceConfiguration[]
  ilmEnabled: boolean
  showPreCreationHelp?: boolean
  showRecommended?: boolean
}

class IlmSummary extends Component<Props> {
  render() {
    const {
      data,
      instanceConfigurations,
      title,
      ilmEnabled,
      showPreCreationHelp,
      showRecommended,
    } = this.props
    const dataInstances = data.map((instance) => {
      const configuration = getInstanceConfigurationById(
        instanceConfigurations,
        instance.instance_configuration_id,
      )
      return extractInstanceTemplateConfigFieldsForEs(instance, configuration)
    })
    const nodeAttributesExist = dataInstances.some(
      (node) => node.nodeAttributes !== undefined && !isEmpty(node.nodeAttributes),
    )
    return (
      <Fragment>
        {title && (
          <EuiTitle size='xs'>
            <label htmlFor='selectIlm'>
              <h5>
                <FormattedMessage
                  id='create-deployment-ilm.title'
                  defaultMessage='{ title }'
                  values={{
                    title,
                  }}
                />
                {showRecommended && (
                  <EuiBadge color='#FEB6DB' className='deploymentTemplate-ilmBadge'>
                    <FormattedMessage
                      id='create-deployment-ilm.recommended'
                      defaultMessage='Recommended'
                    />
                  </EuiBadge>
                )}
              </h5>
            </label>
          </EuiTitle>
        )}
        <EuiSpacer size='s' />
        <EuiText>
          <p>
            <FormattedMessage
              id='create-deployment-ilm.description'
              defaultMessage='Move indices between different stages of the lifecycle (hot, warm, cold, delete) in response to index details and other factors, such as shard size and performance requirements.'
            />
          </p>
        </EuiText>

        <EuiSpacer size='m' />
        {ilmEnabled && dataInstances && nodeAttributesExist && (
          <Fragment>
            <EuiTitle size='xxs'>
              <h5>
                <FormattedMessage
                  id='create-deployment-ilm.node-attributes.title'
                  defaultMessage='Node attributes'
                />
              </h5>
            </EuiTitle>
            <EuiSpacer size='s' />
            <EuiText>
              <p>
                <FormattedMessage
                  id='create-deployment-ilm.node-attributes.description'
                  defaultMessage='Available data nodes and their attributes, necessary to configure index lifecycle management policies in Kibana.'
                />
              </p>
            </EuiText>
            {showPreCreationHelp && (
              <Fragment>
                <EuiSpacer size='s' />
                <EuiCallOut
                  size='s'
                  title={
                    <FormattedMessage
                      id='create-deployment-ilm.configure-after'
                      defaultMessage='ILM policies can be configured after creating your deployment.'
                    />
                  }
                  iconType='iInCircle'
                />
              </Fragment>
            )}

            <EuiSpacer size='m' />
            <EuiFlexGroup gutterSize='xl'>
              {sortBy(dataInstances, `id`).map((instance, index) => {
                if (!instance.nodeAttributes || isEmpty(instance.nodeAttributes)) {
                  return null
                }

                return (
                  <EuiFlexItem key={index} grow={false} className='deploymentTemplate-ilm'>
                    <EuiFlexGroup gutterSize='xs'>
                      <EuiFlexItem grow={5}>
                        <EuiTitle size='xxs'>
                          <h6 className='deploymentTemplate-attributeTitle'>
                            <EuiIcon
                              type={`logoElasticsearch`}
                              size='m'
                              className='deploymentTemplate-esLogo'
                            />
                            {instance.name}
                          </h6>
                        </EuiTitle>
                        <EuiSpacer size='xs' />
                        <NodeAttributeTags index={index} disabled={true} instance={instance} />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                )
              })}
            </EuiFlexGroup>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default injectIntl(IlmSummary)
