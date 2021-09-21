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
import React, { Component, ReactNode } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { findIndex, get } from 'lodash'

import { EuiComboBox, EuiFlexGroup, EuiRange, EuiSelect, htmlIdGenerator } from '@elastic/eui'

import SliderLabel from './SliderLabel'
import OptionText from '../Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/SizePicker/OptionText'

import './discreteSizePicker.scss'

type Props = WrappedComponentProps & {
  id?: string | null
  mobileThreshold?: number
  disabled?: boolean
  onChange: (newValue: string) => void
  options: Array<{
    value: string
    text: ReactNode
    mobileText?: string
    disabled?: boolean
    children?: any | null
  }>
  value: string
  'data-test-id'?: string
  radioLegend?: ReactNode
  levels?: Array<{
    min: number
    max: number
    color: 'primary' | 'success' | 'warning' | 'danger'
  }>
  className?: string
  instanceCapacityOverrideModal?: boolean
}

type State = {
  isMobile: boolean
  tick: number
}

const makeId = htmlIdGenerator()

const messages = defineMessages({
  placeholder: {
    defaultMessage: `Select a single option`,
    id: `discrete-size-picker-placeholder`,
  },
})

class DiscreteSizePicker extends Component<Props, State> {
  id: string = this.props.id || makeId()

  static defaultProps = {
    id: null,
    disabled: false,
    mobileThreshold: 768,
  }

  state: State = {
    isMobile: false,
    tick: deriveTickState(this.props),
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const nextDerivedTick = deriveTickState(nextProps)

    if (nextDerivedTick !== prevState.tick) {
      return {
        tick: nextDerivedTick,
      }
    }

    return null
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener(`resize`, this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.handleResize)
  }

  render() {
    // We need to actually change the rendering here to avoid
    // having two elements with the one id -- showing/hiding
    // via CSS isn't enough.
    if (this.state.isMobile) {
      return this.renderMobileDropdown()
    }

    // We are still using the slider for Instance override modal
    if (this.props.instanceCapacityOverrideModal) {
      return (
        <div className={this.props.className} data-test-subj={this.props[`data-test-subj`]}>
          {this.renderSlider()}
          {this.renderRadios()}
        </div>
      )
    }

    return this.renderDropdown()
  }

  renderSlider = () => {
    const { options, disabled, levels } = this.props
    const { tick } = this.state

    const sliderPadding =
      100 /
      options.length / // to align with item labels across the range
      2 // applied to left and right

    return (
      <div
        className='discreteSlider'
        style={{
          padding: `0 ${sliderPadding}%`,
          marginLeft: `-${sliderPadding}%`,
          marginRight: `-${sliderPadding}%`,
        }}
      >
        <EuiRange
          aria-hidden={true} // hide from screen readers
          tabIndex={-1} // and use labels' radiogroup for keyboard access
          fullWidth={true}
          disabled={disabled}
          step={1}
          value={tick.toString()}
          min={0}
          max={options.length - 1}
          onChange={(e) => this.onChangeSlider(e.target as HTMLInputElement)}
          levels={levels ? levels : undefined}
        />
      </div>
    )
  }

  renderRadios = () => {
    const { id } = this
    const { options, radioLegend, disabled: sliderDisabled, levels } = this.props
    const { tick } = this.state

    const trialThreshold = get(levels, [`0`, `max`])

    const labelOptions = options.map(({ disabled = false, text, value, children }) => ({
      disabled: disabled || sliderDisabled || false,
      text,
      value,
      children,
    }))

    const name = `${id}--radio-group`

    return (
      <div className='discreteSlider-radios-container'>
        {radioLegend}
        <EuiFlexGroup
          id={id}
          className='discreteSlider-radios'
          role='radiogroup'
          justifyContent='spaceBetween'
          alignItems='flexStart'
          gutterSize='none'
          responsive={false}
          data-test-id={this.props[`data-test-id`]}
        >
          {labelOptions.map((option, index) => (
            <SliderLabel
              key={index}
              name={name}
              value={index.toString()}
              option={option}
              tabIndex={index === tick ? 0 : -1}
              isActive={index === tick}
              isMet={index < tick}
              onChange={(e) => this.onChangeSlider(e.target)}
              children={option.children}
              isPastTrialThreshold={index > trialThreshold}
            />
          ))}
        </EuiFlexGroup>
      </div>
    )
  }

  renderDropdown = () => {
    const { id } = this
    const {
      options,
      disabled,
      intl: { formatMessage },
    } = this.props
    const { tick } = this.state
    const formattedOptions = options.map((option) => {
      delete option.mobileText // mobileText causes a console error in the EuiComboBox

      return {
        ...option,
        label: typeof option.text === `string` ? option.text : ``,
      }
    })

    return (
      <EuiComboBox
        fullWidth={true}
        style={{ minWidth: `500px`, maxWidth: `550px` }}
        isClearable={false}
        isDisabled={disabled}
        id={id}
        renderOption={(option) => this.renderSizeOption(option)}
        placeholder={formatMessage(messages.placeholder)}
        singleSelection={{ asPlainText: true }}
        options={formattedOptions}
        selectedOptions={[formattedOptions[tick]]}
        onChange={(selectedOptions) => this.onChange(selectedOptions)}
        data-test-id={this.props[`data-test-id`] || `size-combo-box`}
        className='fs-unmask'
      />
    )
  }

  renderSizeOption = (option: any) => (
    <OptionText
      primaryOptionText={option.primary_text}
      secondaryOptionText={option.secondary_text}
      cpuText={option.cpu_text}
    />
  )

  renderMobileDropdown = () => {
    const { id } = this
    const { options, disabled } = this.props
    const { tick } = this.state

    const selectOptions = options.map(({ text, mobileText, value }, index) => ({
      value: index.toString(),
      text: mobileText != null && this.state.isMobile ? mobileText : text,
      'data-test-value': value,
    }))

    return (
      <EuiSelect
        className='discreteSlider-mobile-select'
        id={id}
        value={tick.toString()}
        disabled={disabled}
        options={selectOptions}
        onChange={(e) => this.onChangeSlider(e.target)}
        data-test-id={this.props[`data-test-id`]}
      />
    )
  }

  onChange = (selectedOptions: any[]) => {
    const { options } = this.props
    const selected = selectedOptions[0]
    const selectedIndex = options.map((options) => options.value).indexOf(selected.value)

    this.setTick(selectedIndex)
  }

  onChangeSlider = (target: HTMLInputElement | HTMLSelectElement) => {
    this.setTick(parseInt(target.value, 10))
  }

  setTick = (newTick: number) => {
    const { options, onChange, disabled: sliderDisabled } = this.props

    if (newTick !== this.state.tick) {
      const newOption = options[newTick]

      if (sliderDisabled || newOption.disabled) {
        return
      }

      onChange(newOption.value)
    }
  }

  handleResize = () => {
    if (!this.props.mobileThreshold) {
      return
    }

    const isMobile = window.innerWidth <= this.props.mobileThreshold

    if (isMobile !== this.state.isMobile) {
      this.setState({ isMobile })
    }
  }
}

function deriveTickState(props: Props): number {
  const { value, options } = props
  const index = findIndex(options, { value })

  if (index >= 0) {
    return index
  }

  const firstAvailable = findIndex(options, (x) => !x.disabled)

  return Math.max(firstAvailable, 0)
}

export default injectIntl(DiscreteSizePicker)
