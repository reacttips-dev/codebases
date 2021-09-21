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

import { cloneDeep, differenceWith, flatten } from 'lodash'

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'

import {
  EuiButton,
  EuiCallOut,
  EuiCode,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiIconTip,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiRouterLinkButtonEmpty, CuiTable, CuiTableColumn } from '../../cui'

import DocLink from '../DocLink'
import DangerButton, { DangerButtonModalProps } from '../DangerButton'

import { getIndexHalflifeFromSeconds } from '../../lib/curation'
import { deploymentUrl } from '../../lib/urlBuilder'
import {
  getDeploymentSettingsFromGet,
  getEsPlanFromGet,
  getNodeAttributesOnWarmNodes,
  getFirstEsClusterFromGet,
  shouldMigrateToIlm,
} from '../../lib/stackDeployments'

import history from '../../lib/history'

import { getIlmMigrationLsKey } from '../../constants/localStorageKeys'

import { getConfigForKey } from '../../store'

import { StackDeployment } from '../../types'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'
import { IndexPatternConversion } from '../../actions/ilm/migrateToIlm'

import './ilmMigration.scss'

type Props = {
  stackDeployment: StackDeployment | null
  ilmMigrationFeature: boolean
  migrateToIlm: (params: {
    deployment: StackDeployment
    resource: ElasticsearchResourceInfo
    indexPatterns: IndexPatternConversion[]
  }) => Promise<any>
}

type State = {
  patterns: IndexPatternToIlmPolicy[]
  error: Error
  dataAttributeOptions: DataAttributeOptions[]
}

type Error = {
  title: ReactNode
  message?: ReactNode
} | null

type IndexPatternToIlmPolicy = {
  index_pattern: string
  policy_name: string
  trigger_interval_seconds: number
  node_attributes: string
  index: number
  selected: boolean
  attributeValid: boolean
  policyNameValid: boolean
  attributeErrorType: 'format' | 'reusedAttribute' | 'required' | null
}

type DataAttributeOptions = {
  label: string
}

const messages = defineMessages({
  hours: {
    id: `ilm-migration.duration-in-hours`,
    defaultMessage: `{amount} {amount, plural, one {hour} other {hours}}`,
  },
  days: {
    id: `ilm-migration.duration-in-days`,
    defaultMessage: `{amount} {amount, plural, one {day} other {days}}`,
  },
  weeks: {
    id: `ilm-migration.duration-in-weeks`,
    defaultMessage: `{amount} {amount, plural, one {week} other {weeks}}`,
  },
  months: {
    id: `ilm-migration.duration-in-months`,
    defaultMessage: `{amount} {amount, plural, one {month} other {months}}`,
  },
})

export default class IlmMigration extends Component<Props, State> {
  state: State = this.getInitialState()

  getInitialState(): State {
    return {
      patterns: this.getInitialPatterns(),
      dataAttributeOptions: this.getInitialOptions(),
      error: null,
    }
  }

  componentDidMount() {
    if (!this.props.stackDeployment) {
      return
    }

    if (!this.props.ilmMigrationFeature) {
      history.replace(deploymentUrl(this.props.stackDeployment.id))
    }

    if (!shouldMigrateToIlm({ deployment: this.props.stackDeployment })) {
      history.replace(deploymentUrl(this.props.stackDeployment.id))
    }
  }

  render() {
    const { stackDeployment, ilmMigrationFeature } = this.props
    const { patterns, error } = this.state

    if (!stackDeployment) {
      return null
    }

    if (!shouldMigrateToIlm({ deployment: stackDeployment })) {
      return null
    }

    if (!ilmMigrationFeature) {
      return null
    }

    const plan = getEsPlanFromGet({ deployment: stackDeployment! })

    if (!plan || !plan.elasticsearch) {
      return null
    }

    const {
      elasticsearch: { curation },
    } = plan

    const columns = this.getColumns()
    const selectedPatterns = patterns.filter((pattern) => pattern.selected)

    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

    const eceAddOnText = isUserConsole ? null : (
      <FormattedMessage
        id='ilm-migration.descriptive-intro.ece-addon'
        defaultMessage='Assign a node attribute that the ILM policies will use to identify the warm node {warmNodeName} for shard allocation.'
        values={{
          warmNodeName: <EuiCode>{curation!.to_instance_configuration_id}</EuiCode>,
        }}
      />
    )

    const modal = this.renderModal()
    return (
      <div data-test-id='ilmMigration'>
        <EuiText>
          <p>
            <FormattedMessage
              id='ilm-migration.link-intro'
              defaultMessage='While migrating, you replace your index curation configuration with {ilm}'
              values={{
                ilm: (
                  <DocLink link='indexManagementDocLink'>
                    <FormattedMessage
                      id='ilm-migration.ilm'
                      defaultMessage='Index Lifecycle Management (ILM)'
                    />
                  </DocLink>
                ),
              }}
            />
          </p>
          <p>
            <FormattedMessage
              id='ilm-migration.descriptive-intro'
              defaultMessage='Select which index curation patterns should be transformed into ILM policies. Policy names must be unique. {eceAddOn}'
              values={{
                eceAddOn: eceAddOnText,
              }}
            />
          </p>
        </EuiText>
        <EuiSpacer />

        <CuiTable<IndexPatternToIlmPolicy>
          rows={patterns}
          columns={columns}
          onSelectionChange={(selectedItems) => this.updateSelectedItems(selectedItems)}
          getRowId={(indexPattern, index) => `${indexPattern.index_pattern}-${index}`}
          isSelectableRow={(_) => true}
          selectedRows={selectedPatterns}
          className='ilmMigration-table'
        />

        {selectedPatterns.length === 0 && patterns.length > 0 && (
          <Fragment>
            <EuiSpacer />
            <EuiCallOut
              data-test-id='ilmMigration-noIndicesSelected'
              color='warning'
              title={
                <FormattedMessage
                  id='ilm-migration.no-patterns-selected'
                  defaultMessage='No index patterns selected'
                />
              }
            >
              <FormattedMessage
                id='ilm-migration.no-index-patterns-selected.description'
                defaultMessage='You can enable ILM, but you will lose your index curation settings. To manage your indices, you must manually configure new ILM policies in Kibana once you have enabled ILM.'
              />
            </EuiCallOut>
          </Fragment>
        )}

        {selectedPatterns.length === 0 && patterns.length === 0 && (
          <Fragment>
            <EuiSpacer />
            <EuiCallOut
              data-test-id='ilmMigration-noIndices'
              color='warning'
              title={
                <FormattedMessage
                  id='ilm-migration.no-patterns'
                  defaultMessage='No index patterns'
                />
              }
            >
              <FormattedMessage
                id='ilm-migration.no-index-patterns.description'
                defaultMessage="You can enable ILM, but you don't currently have any index curation patterns. To manage your indices, you must manually configure new ILM policies in Kibana once you have enabled ILM."
              />
            </EuiCallOut>
          </Fragment>
        )}

        <EuiSpacer />

        {error && this.renderError()}

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            {patterns.length !== selectedPatterns.length ? (
              <DangerButton
                buttonType={EuiButton}
                onConfirm={this.migrate}
                color={selectedPatterns.length === 0 ? 'warning' : 'primary'}
                modal={modal}
              >
                {selectedPatterns.length === 0 ? (
                  <FormattedMessage
                    id='ilm-migration.remove-curation'
                    defaultMessage='Remove index curation and enable ILM'
                  />
                ) : (
                  <FormattedMessage id='ilm-migration.migrate' defaultMessage='Migrate' />
                )}
              </DangerButton>
            ) : (
              <EuiButton
                fill={true}
                onClick={this.migrate}
                data-test-id='ilmMigration-migrateButton'
              >
                <FormattedMessage id='ilm-migration.migrate' defaultMessage='Migrate' />
              </EuiButton>
            )}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <CuiRouterLinkButtonEmpty size='s' to={deploymentUrl(stackDeployment.id)}>
              <FormattedMessage id='ilm-migration.cancel' defaultMessage='Cancel' />
            </CuiRouterLinkButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  renderModal = (): DangerButtonModalProps => {
    const { patterns } = this.state
    const selectedPatterns = patterns.filter((pattern) => pattern.selected)

    if (selectedPatterns.length === 0) {
      const body = (
        <Fragment>
          <FormattedMessage
            id='ilm-migration.confirm-modal.no-patterns.body-top'
            defaultMessage='This operation enables ILM and removes your index curation patterns. The following indices will no longer be curated:'
          />
          {patterns.map((pattern) => (
            <Fragment key={pattern.index_pattern}>
              <EuiSpacer size='s' />

              <EuiCode className='ilmMigration-dangerCode' transparentBackground={true}>
                {pattern.index_pattern}
              </EuiCode>
            </Fragment>
          ))}
          <EuiSpacer size='s' />
          <FormattedMessage
            id='ilm-migration.confirm-modal.no-patterns.body-bottom'
            defaultMessage='Do you want to proceed?'
          />
        </Fragment>
      )
      return {
        title: (
          <FormattedMessage
            id='ilm-migration.confirm-modal.no-patterns.title'
            defaultMessage='Migrate to ILM without index patterns?'
          />
        ),
        body,
        confirmButtonText: (
          <FormattedMessage
            id='ilm-migration.confirm-modal.no-patterns.remove-curation'
            defaultMessage='Remove index curation and enable ILM'
          />
        ),
      }
    }

    const unmigratedPatterns = differenceWith(
      patterns,
      selectedPatterns,
      (patternA, patternB) =>
        patternA.index_pattern === patternB.index_pattern &&
        patternA.trigger_interval_seconds === patternB.trigger_interval_seconds,
    )

    const body = (
      <Fragment>
        <FormattedMessage
          id='ilm-migration.confirm-modal.diff-patterns.body-top'
          defaultMessage='You will migrate the following index patterns:'
        />
        {selectedPatterns.map((pattern) => (
          <Fragment key={pattern.index_pattern}>
            <EuiSpacer size='s' />

            <EuiCode transparentBackground={true}>{pattern.index_pattern}</EuiCode>
          </Fragment>
        ))}
        <EuiSpacer size='s' />
        <FormattedMessage
          id='ilm-migration.confirm-modal.diff-patterns.body-bottom'
          defaultMessage="Index patterns that won't be migrated:"
        />
        {unmigratedPatterns.map((pattern) => (
          <Fragment key={pattern.index_pattern}>
            <EuiSpacer size='s' />

            <EuiCode className='ilmMigration-dangerCode' transparentBackground={true}>
              {pattern.index_pattern}
            </EuiCode>
          </Fragment>
        ))}
      </Fragment>
    )
    return {
      title: (
        <FormattedMessage
          id='ilm-migration.confirm-modal.diff-patterns.title'
          defaultMessage='Migrate {selectedCount} out of {totalCount} index patterns?'
          values={{
            selectedCount: selectedPatterns.length,
            totalCount: patterns.length,
          }}
        />
      ),
      body,
      confirmButtonText: (
        <FormattedMessage
          id='ilm-migration.confirm-modal.diff-patterns.continue'
          defaultMessage='Continue migration'
        />
      ),
    }
  }

  renderError() {
    const { error } = this.state

    if (!error) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut color='danger' title={error.title} iconType='alert'>
          {error.message}
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  migrate = () => {
    const { migrateToIlm, stackDeployment } = this.props
    const { patterns } = this.state

    if (!stackDeployment) {
      return
    }

    const resource = getFirstEsClusterFromGet({ deployment: stackDeployment })

    if (!resource) {
      return
    }

    const selectedPatterns = patterns.filter((pattern) => pattern.selected)

    if (!this.validateForm()) {
      return
    }

    const indexPatterns = selectedPatterns.map((pattern) => {
      const attrArray = pattern.node_attributes.split(':')
      const attrKey = attrArray[0]
      const attrValue = attrArray[1]

      return {
        index_pattern: pattern.index_pattern,
        policy_name: pattern.policy_name,
        node_attributes: {
          [attrKey]: attrValue,
        },
      }
    })

    return migrateToIlm({
      deployment: stackDeployment,
      resource,
      indexPatterns,
    })
      .then(() => {
        history.push(deploymentUrl(stackDeployment!.id))
        localStorage.setItem(getIlmMigrationLsKey({ deploymentId: stackDeployment!.id }), `true`)
      })
      .catch((errors) => {
        const possibleErrors = {
          400: {
            title: (
              <FormattedMessage
                id='ilm-migration.unique-attribute'
                defaultMessage='Attributes must be unique.'
              />
            ),
          },
          404: {
            title: (
              <FormattedMessage
                id='ilm-migration.not-found'
                defaultMessage='This deployment could not be found.'
              />
            ),
          },
          449: {
            title: (
              <FormattedMessage
                id='ilm-migration.wrong-permissions'
                defaultMessage='You do not have permission to enable ILM'
              />
            ),
          },
          500: {
            title: (
              <FormattedMessage
                id='ilm-migration.server-unexpected-error-title'
                defaultMessage='Something went wrong'
              />
            ),
            message: (
              <FormattedMessage
                id='ilm-migration.server-unexpected-error'
                defaultMessage='The server encountered an internal error and was not able to complete your request. Try again later'
              />
            ),
          },
        }

        this.setState({ error: possibleErrors[errors.response.status] })
      })
  }

  validateForm = () => {
    const { patterns } = this.state

    let isFormValid = true
    const newPatterns = cloneDeep(patterns)
    const usedKeys = {}
    let reusedError = false
    let reusedKey = ''

    newPatterns.forEach((pattern) => {
      if (!pattern.selected) {
        return
      }

      let nodeAttributeValid = isValidNodeAttribute(pattern.node_attributes)
      const policyNameValid = pattern.policy_name.length > 0

      const attrArray = pattern.node_attributes.split(':')
      const attrKey = attrArray[0]
      const attrValue = attrArray[1]

      if (!nodeAttributeValid || !policyNameValid) {
        isFormValid = false
      }

      if (!nodeAttributeValid) {
        pattern.attributeErrorType = 'format'
      }

      if (pattern.node_attributes.length === 0) {
        // okay to overwrite the above
        pattern.attributeErrorType = 'required'
      }

      if (!usedKeys[attrKey]) {
        usedKeys[attrKey] = attrValue
      } else {
        if (usedKeys[attrKey] !== attrValue) {
          isFormValid = false
          reusedError = true
          reusedKey = attrKey
          nodeAttributeValid = false
        }
      }

      pattern.attributeValid = nodeAttributeValid
      pattern.policyNameValid = policyNameValid
    })

    if (reusedError) {
      this.setState({
        error: {
          title: (
            <FormattedMessage
              id='ilm-migration.no-reuse-attribute'
              defaultMessage='You cannot assign the attribute {attrName} to multiple values. Try reusing {correctAttr}.'
              values={{
                attrName: <EuiCode>{reusedKey}</EuiCode>,
                correctAttr: <EuiCode>{`${reusedKey}:${usedKeys[reusedKey]}`}</EuiCode>,
              }}
            />
          ),
        },
      })
    } else {
      this.setState({ error: null })
    }

    this.setState({ patterns: newPatterns })

    return isFormValid
  }

  getColumns(): Array<CuiTableColumn<IndexPatternToIlmPolicy>> {
    const { stackDeployment } = this.props
    const { dataAttributeOptions } = this.state
    const plan = getEsPlanFromGet({ deployment: stackDeployment! })

    if (!plan || !plan.elasticsearch) {
      return []
    }

    const {
      elasticsearch: { curation },
    } = plan

    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

    const dataAttributeErrors = {
      format: (
        <FormattedMessage
          id='ilm-migration.attribute.wrong-format'
          defaultMessage='Incorrect format'
        />
      ),
      reusedAttribute: (
        <FormattedMessage
          id='ilm-migration.attribute.reused-attribute'
          defaultMessage='You can only define one value per attribute'
        />
      ),
      required: (
        <FormattedMessage id='ilm-migration.attribute.required' defaultMessage='Required' />
      ),
    }

    const columns: Array<CuiTableColumn<IndexPatternToIlmPolicy>> = [
      {
        label: (
          <FormattedMessage
            id='ilm-migration.index-curation-pattern'
            defaultMessage='Index curation pattern'
          />
        ),
        render: (indexPattern) => {
          const { amount, type } = getIndexHalflifeFromSeconds(
            indexPattern.trigger_interval_seconds,
          )
          return (
            <Fragment>
              <FormattedMessage
                id='ilm-migration.curation-pattern'
                defaultMessage='Indices matching {name} are moved from {hotNode} to {warmNode} after {timeLength}'
                values={{
                  hotNode: <strong>{curation!.from_instance_configuration_id}</strong>,
                  warmNode: <strong>{curation!.to_instance_configuration_id}</strong>,
                  name: <EuiCode>{indexPattern.index_pattern}</EuiCode>,
                  timeLength: <FormattedMessage {...messages[type]} values={{ amount }} />,
                }}
              />
            </Fragment>
          )
        },
      },
      {
        label: '',
        render: (indexPattern) => (
          <Fragment>
            {indexPattern.selected && <EuiIcon type={`sortRight`} size='s' color='subdued' />}
          </Fragment>
        ),
        width: `40px`,
      },
      {
        label: (
          <FormattedMessage id='ilm-migration.ilm-policy-name' defaultMessage='ILM policy name' />
        ),
        render: (indexPattern) => (
          <Fragment>
            {indexPattern.selected && (
              <EuiFormRow
                isInvalid={!indexPattern.policyNameValid}
                error={
                  <FormattedMessage
                    id='ilm-migration.ilm-policy-name.required'
                    defaultMessage='Required'
                  />
                }
              >
                <EuiFieldText
                  value={indexPattern.policy_name}
                  onChange={(e) => this.updatePolicyName(e.target.value, indexPattern.index)}
                  isInvalid={!indexPattern.policyNameValid}
                />
              </EuiFormRow>
            )}
          </Fragment>
        ),
      },
    ]

    if (!isUserConsole) {
      columns.push({
        id: `shard-allocation-attribute`,
        label: (
          <Fragment>
            <FormattedMessage
              id='ilm-migration.shard-allocation-attribute'
              defaultMessage='Shard allocation attribute - warm phase'
              data-test-id='ilmMigration-shardAllocationAttribute'
            />
            &nbsp;
            <EuiIconTip
              type='questionInCircle'
              content={
                <FormattedMessage
                  id='ilm-migration.tool-tip'
                  defaultMessage='This node attribute helps Elasticsearch identify your warm node: {warmNode}. It can be modified once the ILM policy is created.'
                  values={{
                    warmNode: <strong>{curation!.to_instance_configuration_id}</strong>,
                  }}
                />
              }
            />
          </Fragment>
        ),
        render: (indexPattern) => {
          if (dataAttributeOptions.length > 0) {
            return (
              <Fragment>
                {indexPattern.selected && (
                  <EuiFormRow
                    helpText={
                      <FormattedMessage
                        id='ilm-migration.attribute-help-text'
                        defaultMessage='Format must be attribute:value. E.g: data:warm'
                      />
                    }
                    isInvalid={!indexPattern.attributeValid}
                    error={
                      indexPattern.attributeErrorType &&
                      dataAttributeErrors[indexPattern.attributeErrorType]
                    }
                  >
                    <EuiComboBox
                      options={dataAttributeOptions}
                      singleSelection={true}
                      selectedOptions={
                        indexPattern.node_attributes
                          ? [{ label: indexPattern.node_attributes }]
                          : []
                      }
                      onChange={(value) => {
                        this.updatePolicyAttribute(
                          value[0] ? value[0].label : '',
                          indexPattern.index,
                        )
                      }}
                      onCreateOption={(searchValue, flattenedOptions) =>
                        this.onCreateOption(searchValue, flattenedOptions, indexPattern.index)
                      }
                      isInvalid={!indexPattern.attributeValid}
                    />
                  </EuiFormRow>
                )}
              </Fragment>
            )
          }

          return (
            <Fragment>
              {indexPattern.selected && (
                <EuiFormRow
                  helpText={
                    <FormattedMessage
                      id='ilm-migration.attribute-help-text'
                      defaultMessage='Format must be attribute:value. E.g: data:warm'
                    />
                  }
                  onBlur={(e) => this.validateAttribute(e.target.value, indexPattern.index)}
                  isInvalid={!indexPattern.attributeValid}
                  error={
                    indexPattern.attributeErrorType &&
                    dataAttributeErrors[indexPattern.attributeErrorType]
                  }
                >
                  <EuiFieldText
                    value={indexPattern.node_attributes}
                    onChange={(e) => this.updatePolicyAttribute(e.target.value, indexPattern.index)}
                    isInvalid={!indexPattern.attributeValid}
                  />
                </EuiFormRow>
              )}
            </Fragment>
          )
        },
      })
    }

    return columns
  }

  getInitialOptions(): Array<{ label: string }> {
    const { stackDeployment } = this.props

    const dataAttributeSets = getNodeAttributesOnWarmNodes({ deployment: stackDeployment! })

    const dataAttributeLabels = flatten(
      dataAttributeSets.map((set) => {
        if (set) {
          return Object.keys(set).map((key) => `${key}:${set[key]}`)
        }

        return []
      }),
    ).filter((array) => array.length > 0)

    return dataAttributeLabels
      .filter((label) => label !== null)
      .map((label) => ({
        label,
      }))
  }

  getInitialPatterns(): IndexPatternToIlmPolicy[] {
    const { stackDeployment } = this.props

    if (!stackDeployment) {
      return []
    }

    const options = this.getInitialOptions()

    const settings = getDeploymentSettingsFromGet({ deployment: stackDeployment })

    // sanity - this page shouldn't even be displayed if there's no curation
    if (!settings || !settings.curation) {
      return []
    }

    return settings.curation.specs.map((indexPattern, index) => ({
      index_pattern: indexPattern.index_pattern,
      policy_name: indexPattern.index_pattern,
      trigger_interval_seconds: indexPattern.trigger_interval_seconds,
      node_attributes: options.length > 0 ? '' : 'data:warm',
      index,
      selected: true,
      policyNameValid: true,
      attributeValid: true,
      attributeErrorType: null,
    }))
  }

  onCreateOption = (searchValue, flattenedOptions, index) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase()

    if (!normalizedSearchValue) {
      return
    }

    if (!isValidNodeAttribute(searchValue)) {
      return
    }

    const newOption = {
      label: searchValue,
    }

    if (
      flattenedOptions.findIndex(
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue,
      ) === -1
    ) {
      this.setState((prevState) => ({
        dataAttributeOptions: prevState.dataAttributeOptions.concat(newOption),
      }))
    }

    // Select the option.
    this.updatePolicyAttribute(searchValue, index)
  }

  updatePolicyName = (name, index) => {
    const { patterns } = this.state

    const newPatterns = cloneDeep(patterns)

    newPatterns[index].policy_name = name
    this.setState({ patterns: newPatterns })
  }

  updatePolicyAttribute = (attribute, index) => {
    const { patterns } = this.state

    const newPatterns = cloneDeep(patterns)

    newPatterns[index].node_attributes = attribute
    this.setState({ patterns: newPatterns })
  }

  validateAttribute = (attribute, index) => {
    const { patterns } = this.state

    const newPatterns = cloneDeep(patterns)

    newPatterns[index].attributeValid = isValidNodeAttribute(attribute)

    this.setState({ patterns: newPatterns })
  }

  updateSelectedItems = (selectedItems) => {
    const { patterns } = this.state

    const newPatterns = cloneDeep(patterns).map((pattern) => {
      const findItemInSelected = selectedItems.find(
        (selectedPattern) =>
          selectedPattern.index_pattern === pattern.index_pattern &&
          selectedPattern.trigger_interval_seconds === pattern.trigger_interval_seconds,
      )
      const isSelected = typeof findItemInSelected !== 'undefined'

      return {
        ...pattern,
        selected: isSelected,
      }
    })

    this.setState({ patterns: newPatterns })
  }
}

function isValidNodeAttribute(value) {
  const validNodeAttribute = /^[a-zA-Z0-9-_]+:[a-zA-Z0-9-_]+$/
  const validCharacters = validNodeAttribute.test(value)

  return validCharacters
}
