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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { isEmpty } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiStepsHorizontal,
} from '@elastic/eui'

import { AnyWizardStepDefinition, WizardStepDefinition } from './types'

import { CuiAlert } from '../Alert'
import { CuiButton } from '../Button'

type Props<TStepProps> = {
  intl: IntlShape
  steps: Array<WizardStepDefinition<TStepProps>>
  stepProps: TStepProps
  initialStep?: WizardStepDefinition<TStepProps>
  completeButtonLabel: ReactNode
  completeButtonHelpComponent?: ReactNode
  completeRequiresSudo?: boolean
  onComplete: () => void
  completionError: Error | ReactNode
  isBusyCompleting: boolean
}

type State<TStepProps> = {
  currentStep: WizardStepDefinition<TStepProps>
  farthestStep: WizardStepDefinition<TStepProps>
  pristine: boolean
  attemptedComplete: boolean
}

class CuiWizardImpl<TStepProps> extends Component<Props<TStepProps>, State<TStepProps>> {
  state = this.getDefaultState()

  render() {
    const euiSteps = this.getEuiSteps()

    return (
      <div>
        <EuiStepsHorizontal steps={euiSteps} />

        <EuiSpacer />

        {this.renderCurrentStep()}

        <EuiSpacer size='l' />

        {this.renderNavigation()}
      </div>
    )
  }

  renderCurrentStep() {
    const { stepProps } = this.props
    const { currentStep } = this.state
    const { ConfigureStep } = currentStep
    const pristine = !this.showStepErrors(currentStep)

    return (
      <ConfigureStep
        {...stepProps}
        pristine={pristine}
        resetPristine={() => this.setState({ pristine: true })}
      />
    )
  }

  renderNavigation() {
    const {
      completeButtonLabel,
      completeButtonHelpComponent,
      completeRequiresSudo,
      completionError,
      isBusyCompleting,
    } = this.props

    const { currentStep, attemptedComplete } = this.state

    const showErrors = this.showStepErrors(currentStep)
    const warnOnNext = showErrors && !this.validateStep(currentStep)
    const warnOnComplete = attemptedComplete && this.hasInvalidSteps()
    const nextButtonColor = warnOnNext ? `warning` : `primary`
    const completeButtonColor = warnOnComplete ? `warning` : `secondary`

    return (
      <Fragment>
        <EuiFlexGroup justifyContent='flexEnd' gutterSize='m'>
          {this.hasPreviousStep() && (
            <EuiFlexItem grow={false}>
              <div data-test-id='wizard-button-back'>
                <EuiButtonEmpty iconType='arrowLeft' onClick={this.goToPreviousStep}>
                  {this.getPreviousStepTitle()}
                </EuiButtonEmpty>
              </div>
            </EuiFlexItem>
          )}

          {this.hasNextStep() ? (
            <EuiFlexItem grow={false}>
              <div data-test-id='wizard-button-next'>
                <EuiButton
                  iconType='arrowRight'
                  iconSide='right'
                  color={nextButtonColor}
                  onClick={this.goToNextStep}
                  fill={true}
                >
                  {this.getNextStepTitle()}
                </EuiButton>
              </div>
            </EuiFlexItem>
          ) : (
            <EuiFlexItem grow={false} data-test-id='wizard-button-complete'>
              <CuiButton
                color={completeButtonColor}
                iconType='check'
                fill={true}
                onClick={this.complete}
                spin={isBusyCompleting}
                requiresSudo={completeRequiresSudo}
              >
                {completeButtonLabel}
              </CuiButton>

              {completeButtonHelpComponent}
            </EuiFlexItem>
          )}
        </EuiFlexGroup>

        {completionError && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='warning'>{completionError}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  getDefaultState() {
    const { initialStep, steps } = this.props
    const firstStep = initialStep || steps[0]

    return {
      currentStep: firstStep,
      farthestStep: firstStep,
      pristine: true,
      attemptedComplete: false,
    }
  }

  getEuiSteps = () => {
    const {
      steps,
      intl: { formatMessage },
    } = this.props
    const { currentStep } = this.state

    return steps.map((step) => {
      const { title } = step
      const isSelected = currentStep === step
      const showErrors = this.showStepErrors(step)
      const invalid = showErrors && !this.validateStep(step)
      const status = (invalid ? `warning` : undefined) as 'warning' | undefined

      return {
        title: formatMessage(title),
        status,
        isComplete: !status && this.isStepAfter(currentStep, step),
        isSelected,
        onClick: () => this.jumpToStep(step),
        disabled: !this.canJumpToStep(step),
      }
    })
  }

  getPreviousStep(): AnyWizardStepDefinition | null {
    const { steps } = this.props
    const { currentStep } = this.state
    const stepIndex = steps.indexOf(currentStep)

    for (const step of steps.slice(0, stepIndex).reverse()) {
      if (!this.shouldSkipStep(step)) {
        return step
      }
    }

    return null
  }

  getPreviousStepTitle(): string | ReactNode {
    const {
      steps,
      intl: { formatMessage },
    } = this.props
    const { currentStep } = this.state
    const stepIndex = steps.indexOf(currentStep)

    for (const step of steps.slice(0, stepIndex).reverse()) {
      if (!this.shouldSkipStep(step)) {
        return formatMessage(step.title)
      }
    }

    return <FormattedMessage id='deployment-template-wizard.prev-step' defaultMessage='Back' />
  }

  getNextStep(): AnyWizardStepDefinition | null {
    const { steps } = this.props
    const { currentStep } = this.state
    const stepIndex = steps.indexOf(currentStep)

    for (const step of steps.slice(stepIndex + 1)) {
      if (!this.shouldSkipStep(step)) {
        return step
      }
    }

    return null
  }

  getNextStepTitle(): string | ReactNode {
    const {
      steps,
      intl: { formatMessage },
    } = this.props
    const { currentStep } = this.state
    const stepIndex = steps.indexOf(currentStep)

    for (const step of steps.slice(stepIndex + 1)) {
      if (!this.shouldSkipStep(step)) {
        return formatMessage(step.title)
      }
    }

    return <FormattedMessage id='deployment-template-wizard.next-step' defaultMessage='Next' />
  }

  hasPreviousStep(): boolean {
    return this.getPreviousStep() !== null
  }

  hasNextStep(): boolean {
    return this.getNextStep() !== null
  }

  shouldSkipStep = (step: AnyWizardStepDefinition): boolean => {
    const { stepProps } = this.props
    const { skipStep } = step

    if (!skipStep) {
      return false
    }

    return skipStep(stepProps)
  }

  canJumpToStep(step: AnyWizardStepDefinition): boolean {
    const skip = this.shouldSkipStep(step)

    if (skip) {
      return false
    }

    const { steps } = this.props
    const { farthestStep } = this.state
    const stepIndex = steps.indexOf(step)
    const farthestStepIndex = steps.indexOf(farthestStep)
    const intermediateSteps = steps.slice(farthestStepIndex + 1, stepIndex)

    // should we skip every step in between the last visited step and the desired step?
    for (const intermediateStep of intermediateSteps) {
      if (!this.shouldSkipStep(intermediateStep)) {
        return false
      }
    }

    return true
  }

  goToPreviousStep = () => {
    this.jumpToStep(this.getPreviousStep() as AnyWizardStepDefinition)
  }

  goToNextStep = () => {
    this.jumpToStep(this.getNextStep() as AnyWizardStepDefinition)
  }

  jumpToStep(step: AnyWizardStepDefinition) {
    const { currentStep, farthestStep } = this.state

    if (this.isStepAfter(step, farthestStep) && !this.validateStep(currentStep)) {
      this.setState({ pristine: false })
      return
    }

    this.setStep(step)
  }

  showStepErrors(step: AnyWizardStepDefinition): boolean {
    const { currentStep, farthestStep, pristine, attemptedComplete } = this.state
    const isSelected = currentStep === step
    const before = this.isStepBefore(step, farthestStep)

    return (
      (isSelected && (before || !pristine || attemptedComplete)) ||
      (!isSelected && (before || step === farthestStep))
    )
  }

  isStepBefore(left: AnyWizardStepDefinition, right: AnyWizardStepDefinition) {
    const { steps } = this.props
    const leftIndex = steps.indexOf(left)
    const rightIndex = steps.indexOf(right)

    return leftIndex < rightIndex
  }

  isStepAfter(left: AnyWizardStepDefinition, right: AnyWizardStepDefinition) {
    const { steps } = this.props
    const leftIndex = steps.indexOf(left)
    const rightIndex = steps.indexOf(right)

    return leftIndex > rightIndex
  }

  validateStep(step): boolean {
    const skip = this.shouldSkipStep(step)

    if (skip) {
      return true
    }

    const { validateStep } = step

    if (!validateStep) {
      return true
    }

    const { stepProps } = this.props

    const errors = validateStep(stepProps)

    return isEmpty(errors)
  }

  hasInvalidSteps(): boolean {
    return this.props.steps.some((step) => !this.validateStep(step))
  }

  setStep(step: AnyWizardStepDefinition) {
    const { stepProps } = this.props
    const { farthestStep } = this.state

    const nextFarthestStep = this.isStepAfter(step, farthestStep) ? step : farthestStep

    const { onBeforeEnter } = step

    if (onBeforeEnter) {
      onBeforeEnter(stepProps)
    }

    this.setState({
      currentStep: step,
      farthestStep: nextFarthestStep,
      pristine: true,
    })
  }

  complete = () => {
    if (this.hasInvalidSteps()) {
      this.setState({ pristine: false, attemptedComplete: true })
      return
    }

    const { onComplete } = this.props

    onComplete()
  }
}

/**
 * Generates a new wizard class for the supplied step type. The reason this exists
 * is because it's hard to use a component with generics and wrap it with `injectIntl`,
 * and still be able to apply a generic argument afterwards.
 */
export function createCuiWizard<T>() {
  class CuiWizardSpecialized extends CuiWizardImpl<T> {}

  return injectIntl(CuiWizardSpecialized)
}
