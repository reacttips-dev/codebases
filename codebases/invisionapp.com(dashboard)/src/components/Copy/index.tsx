import React, { useState, useRef, useEffect, forwardRef, Ref } from 'react'
import cx from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Button from '../Button'
import { CopyFormat } from './types'

export interface CopyProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'onCopy'> {
  /**
   * The string of text to copy to the clipboard
   */
  stringToCopy: string
  /**
   * The default text of the copy button
   */
  defaultText?: string
  /**
   * The text that appears as the copy button text once the content is copied to the clipboard
   */
  copiedText?: string
  /**
   * The length of time the copiedText will appear before reverting back to the defaultText after copying.
   */

  copyTimeout?: number
  /**
   * Optional callback after copying
   */
  onCopy?: (a: string, b: boolean) => void
  /**
   * What format to copy the string as
   */
  copyFormat?: CopyFormat
}

/**
 * Copy's allow a user to copy some textual data to the clipboard.
 */
const Copy = forwardRef(function Copy(
  props: CopyProps,
  ref?: Ref<HTMLButtonElement>
) {
  const {
    stringToCopy,
    defaultText,
    copiedText,
    copyTimeout,
    className,
    onCopy,
    copyFormat,
    ...rest
  } = props
  const [isCopyTextShowing, setIsCopyTextShowing] = useState(false)
  const timeout = useRef<any>()

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  function handleCopy(a: string, b: boolean) {
    setIsCopyTextShowing(true)
    onCopy && onCopy(a, b)
    timeout.current = setTimeout(() => {
      setIsCopyTextShowing(false)
    }, copyTimeout)
  }

  return (
    <CopyToClipboard
      text={stringToCopy}
      onCopy={handleCopy}
      options={{ format: copyFormat }}
    >
      <Button
        {...rest}
        ref={ref}
        order="secondary"
        size="24"
        as="button"
        type="button"
        role="button"
        className={cx('hds-copy', className)}
        aria-expanded={undefined}
        aria-live="polite"
      >
        {isCopyTextShowing ? copiedText : defaultText}
      </Button>
    </CopyToClipboard>
  )
})
Copy.defaultProps = {
  defaultText: 'Copy',
  copiedText: 'Copied',
  copyTimeout: 2000,
  copyFormat: 'text/plain',
}

export default Copy
