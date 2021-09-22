import React, { forwardRef, Ref, ReactNode } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { Status } from '../../types'

export interface ValidationMessageProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * Should be the same as the corresponding form element
   */
  id: string
  /**
   * Will change the background color of the ValidationMessage
   */
  status?: Status
  /**
   * The content of the validation message. It is okay for thos to be blank
   */
  children?: ReactNode
}

/**
 * ValidationMessages display validation messages for form fields. This component should not be conditionally loaded within your component
 * as the parent div in this component needs to be in the DOM for a screen reader to react to changes in its children.
 */
const ValidationMessage = forwardRef(function ValidationMessage(
  props: ValidationMessageProps,
  ref?: Ref<HTMLDivElement>
) {
  const { className, status, id, children, ...rest } = props
  return (
    <div {...rest} ref={ref} role="alert" id={`${id}-validation`}>
      {children && (
        <div
          className={cx('hds-validation-message hds-type-scale-body-11', {
            [`hds-bg-${status}-100`]: status,
            'hds-bg-surface-20': !status,
            'hds-text-surface-0':
              status && ['success', 'destructive'].indexOf(status) > -1,
            'hds-text-surface-100': !status || ['warning'].indexOf(status) > -1,
          })}
        >
          {children}
        </div>
      )}
    </div>
  )
})

export default ValidationMessage
