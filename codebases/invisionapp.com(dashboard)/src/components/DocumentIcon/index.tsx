import React, { forwardRef, Ref, useMemo } from 'react'
import cx from 'classnames'
import Beta from './Beta'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { DocumentType } from '../../types'

export interface DocumentIconProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size' | 'children'> {
  /**
   * The size, in pixels, of the icon.
   */
  size: '16' | '32'
  /**
   * If true, adds attributes to the SVG element to make it not visible to screen readers.
   */
  isDecorative?: boolean
  /**
   * If true, renders the beta-tagged version of the icon.
   */
  isBeta?: boolean
  /**
   * For a11y purposes.
   */
  'aria-label'?: string
  /**
   * Which document icon to display
   */
  documentType?: DocumentType
  /**
   * If using a custom DocumentIcon, use this prop
   */
  src?: string
}

const DocumentIcon = forwardRef(function DocumentIcon(
  props: DocumentIconProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    color,
    size,
    'aria-label': ariaLabel,
    crossOrigin,
    className,
    isDecorative,
    documentType,
    isBeta,
    src,
    ...rest
  } = props

  const title = useMemo(() => {
    switch (documentType) {
      case 'prototype':
      case 'presentation':
        return 'Prototype'
      case 'board':
        return 'Board'
      case 'rhombus':
        return 'Doc'
      case 'freehand':
        return 'Freehand'
      case 'spec':
        return 'Spec'
      case 'harmony':
        return 'Design'
      default:
        return 'Unknown'
    }
  }, [documentType])

  const allowlistFor16 = [
    'freehand',
    'prototype',
    'spec',
    'board',
    'rhombus',
    'harmony',
    'all-types',
  ]

  const imgSize =
    documentType && allowlistFor16.includes(documentType) && size === '16'
      ? '16'
      : '32'

  const imgSrc =
    src ||
    `https://static.invisionapp-cdn.com/global/icons/documents/${documentType}-${imgSize}.svg`

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-document-icon-wrap', {
        'hds-document-icon-16': size === '16',
        'hds-document-icon-32': size === '32',
      })}
      title={title}
    >
      <div
        className={cx('hds-document-icon-mask', {
          'hds-document-icon-is-beta': isBeta,
          'hds-document-icon-mask-16': size === '16',
          'hds-document-icon-mask-32': size === '32',
        })}
      >
        <img
          className={cx('hds-document-icon', className)}
          src={imgSrc}
          alt={title}
        />
      </div>
      {isBeta && <Beta />}
    </div>
  )
})

DocumentIcon.defaultProps = {
  isDecorative: true,
}

export default DocumentIcon
