import React, { Fragment, ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import Icon from '../../primitives/Icon'

export interface DocumentTitleProps extends HTMLProps<HTMLDivElement> {
  /**
   * The content of the breadcrumb navigation.
   */
  breadcrumbs: ReactNode[]
  /**
   * 	Provides a label that describes the type of navigation provided in the nav element.
   */
  'aria-label': string
}

/**
 * DocumentTitles display a bradcrumb of information about a particular document.
 */
const DocumentTitle = forwardRef(function DocumentTitle(
  props: DocumentTitleProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, breadcrumbs, 'aria-label': ariaLabel, ...rest } = props
  return (
    <Text
      {...rest}
      ref={ref}
      className={cx('hds-document-title hds-space-x-8', className)}
      size="body-12"
      color="surface-100"
      aria-label={ariaLabel}
    >
      {breadcrumbs.map((breadcrumb, i) => (
        <Fragment key={i}>
          <Icon
            name="ChevronRight"
            color="surface-20"
            size="24"
            aria-label=""
            isDecorative
          />
          <div className="hds-document-title-breadrcumb">{breadcrumb}</div>
        </Fragment>
      ))}
    </Text>
  )
})

export default DocumentTitle
