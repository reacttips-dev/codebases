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

import Header from '../../Header'

import CreateStackDeploymentEditorDependencies from '../CreateStackDeploymentEditorDependencies'
import CreateStackDeploymentEditor from '../CreateStackDeploymentEditor'

import { deploymentCreateCrumbs } from '../../../lib/crumbBuilder'

import { CreateEditorComponentConsumerProps } from '../types'

type Props = {
  showTrialExperience: boolean
}

const CreateStackDeployment: FunctionComponent<Props> = ({ showTrialExperience }) => (
  <Fragment>
    {!showTrialExperience && <Header breadcrumbs={deploymentCreateCrumbs()} />}
    <CreateStackDeploymentEditorDependencies>
      {(props: CreateEditorComponentConsumerProps) => <CreateStackDeploymentEditor {...props} />}
    </CreateStackDeploymentEditorDependencies>
  </Fragment>
)

export default CreateStackDeployment
