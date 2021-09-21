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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

import { isPureIndexCurationTemplate } from '../../../lib/stackDeployments'
import { topologyUrl } from '../../../lib/urlBuilder'

import DocLink from '../../DocLink'
import { CuiRouterLinkButton, CuiLink } from '../../../cui'

export interface Props extends WrappedComponentProps {
  deploymentTemplates: DeploymentTemplateInfoV2[]
  fetchDeploymentTemplates: () => Promise<any>
  displayLink?: boolean
}

const IlmTemplateMigrationCallout: FunctionComponent<Props> = ({
  deploymentTemplates,
  displayLink,
}) => {
  const numberTemplatesWithOnlyCuration = deploymentTemplates.filter((deploymentTemplate) =>
    isPureIndexCurationTemplate({ deploymentTemplate }),
  ).length

  if (numberTemplatesWithOnlyCuration === 0) {
    return null
  }

  return (
    <Fragment>
      <EuiCallOut
        data-test-id='ilmTemplateMigration-callout'
        title={
          <FormattedMessage
            id='ilm-template-migration-callout.title'
            defaultMessage='Configure index lifecycle management (ILM)'
          />
        }
        iconType='iInCircle'
      >
        <Fragment>
          <p>
            <FormattedMessage
              id='ilm-template-migration-callout.description'
              defaultMessage='Index curation will soon be deprecated and replaced by {ilm}. You currently have {numberTemplates} that only {numberTemplatesWithOnlyCuration, plural, one {uses} other {use}} index curation. Configure ILM for these templates by adding node attributes to allow new deployments to use ILM instead of index curation.'
              values={{
                ilm: (
                  <DocLink link='indexManagementDocLink'>
                    <FormattedMessage
                      id='ilm-template-migration-callout.ilm'
                      defaultMessage='ILM (index lifecycle management)'
                    />
                  </DocLink>
                ),
                numberTemplates: (
                  <CuiLink to={topologyUrl(`ece-region`)}>
                    <FormattedMessage
                      id='ilm-template-migration-callout.number-templates'
                      defaultMessage='{numberTemplatesWithOnlyCuration, number} {numberTemplatesWithOnlyCuration, plural, one {template} other {templates}}'
                      values={{
                        numberTemplatesWithOnlyCuration,
                      }}
                    />
                  </CuiLink>
                ),
                numberTemplatesWithOnlyCuration,
              }}
            />
          </p>

          {displayLink && (
            <CuiRouterLinkButton
              to={topologyUrl(`ece-region`)}
              data-test-id='ilmTemplateMigration-button'
            >
              <FormattedMessage
                id='ilm-template-migration-callout.view-templates'
                defaultMessage='View templates'
              />
            </CuiRouterLinkButton>
          )}
        </Fragment>
      </EuiCallOut>
      <EuiSpacer />
    </Fragment>
  )
}

export default injectIntl(IlmTemplateMigrationCallout)
