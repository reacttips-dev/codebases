import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import {
  Accordion as AccordionWrapper,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion'
import Icon from '../../primitives/Icon'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { AccordionSections, AccordionArrowPosition } from './types'

export interface AccordionProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  /**
   * The data that powers the Accordion. The content nodes are completely unstyled, so you may need to add appropriate padding or spacing.
   */
  sections: AccordionSections
  /**
   * Don't autocollapse items when expanding other items.
   */
  allowMultipleExpanded?: boolean
  /**
   * Allow the only remaining expanded item to be collapsed.
   */
  allowZeroExpanded?: boolean
  /**
   * Accepts an array of strings and any AccordionItem whose uuid prop matches any one of these strings will be expanded on mount. The UUID will be the zero-index integer of the object within the sections array.
   */
  preExpanded?: string[]
  /**
   * Callback which is invoked when items are expanded or collapsed. Gets passed uuids of the currently expanded AccordionItems.
   */
  onChange?: (uuids: string[]) => void
  /**
   * Where the arrow is rendered relative to the title of each section.
   */
  arrowPosition?: AccordionArrowPosition
}

/**
 * Accordions are a design structure used to show/hide content, and simplify the UI so as to not overwhelm the user with too much information.
 */
const Accordion = forwardRef(function Accordion(
  props: AccordionProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    sections,
    allowMultipleExpanded,
    allowZeroExpanded,
    preExpanded,
    onChange,
    arrowPosition,
    ...rest
  } = props
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-accordion', className, {
        'hds-accordion-arrow-left': arrowPosition === 'left',
        'hds-accordion-arrow-right': arrowPosition === 'right',
      })}
    >
      <AccordionWrapper
        allowMultipleExpanded={allowMultipleExpanded}
        allowZeroExpanded={allowZeroExpanded}
        preExpanded={preExpanded}
        onChange={onChange}
      >
        {sections.map((section, i) => (
          <AccordionItem
            key={String(section.title)}
            uuid={`${i}`}
            className="hds-accordion-item"
          >
            <AccordionItemHeading className="hds-accordion-heading">
              <AccordionItemButton className="hds-accordion-button">
                <span className="hds-accordion-title">{section.title}</span>
                <AccordionItemState>
                  {({ expanded }) => (
                    <Icon
                      name="ChevronDown"
                      className={cx('hds-accordion-icon', {
                        'hds-accordion-icon-expanded': expanded,
                      })}
                      color="surface-100"
                      size="16"
                      isDecorative
                    />
                  )}
                </AccordionItemState>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="hds-accordion-panel">
              {section.content}
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </AccordionWrapper>
    </div>
  )
})

Accordion.defaultProps = {
  arrowPosition: 'right',
}

export default Accordion
