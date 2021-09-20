import classnames from 'classnames'
import React from 'react'
import { Color, TIMING } from '../../utils'
import { Chevron } from '../Chevron'
import { Text } from '../Text'
import { IProps } from './index'

/* eslint no-unused-vars: 0 */
enum openState {
  Closed,
  Closing,
  Opening,
  Opened,
}

interface IState {
  height: number
  isOpen: openState
}

export class AccordionSection extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    hasLine: true,
    largeChevron: false,
  }

  // eslint-disable-next-line react/sort-comp
  private accordionWrapper: React.RefObject<HTMLDivElement>
  constructor(props: IProps) {
    super(props)
    this.state = {
      height: 0,
      isOpen: openState.Closed,
    }
    this.accordionWrapper = React.createRef()
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
    this.returnHeightValue = this.returnHeightValue.bind(this)
  }

  handleCategoryClick() {
    const { isOpen } = this.state
    if (isOpen === openState.Opened) {
      this.animateClosing()
      this.props.setIsActive && this.props.setIsActive(false)
    } else {
      this.animateOpening()
      this.props.setIsActive && this.props.setIsActive(true)
    }
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { isOpen } = this.state
    if (isOpen === openState.Opening && prevState.isOpen === openState.Closed) {
      this.updateOpened()
    } else if (
      this.props.isActive === false ||
      (isOpen === openState.Closing && prevState.isOpen === openState.Opened)
    ) {
      this.updateClosed()
    }
  }

  animateOpening() {
    this.setState({
      height: this.returnRefHeight(this.accordionWrapper.current),
      isOpen: openState.Opening,
    })
  }

  animateClosing() {
    this.setState({
      isOpen: openState.Closing,
    })
  }

  updateOpened() {
    this.setState(
      {
        height: 0,
      },
      () => {
        this.setState({
          height: this.returnRefHeight(this.accordionWrapper.current),
        })
        setTimeout(() => {
          this.setState({
            isOpen: openState.Opened,
          })
        }, TIMING.FAST)
      },
    )
  }

  updateClosed() {
    this.setState(
      {
        height: this.returnRefHeight(this.accordionWrapper.current),
      },
      () => {
        this.setState({
          height: 0,
        })
        setTimeout(() => {
          this.setState({
            isOpen: openState.Closed,
          })
        }, TIMING.FAST)
      },
    )
  }

  returnRefHeight(ref: HTMLDivElement | null) {
    return ref ? ref.clientHeight : 0
  }

  returnHeightValue(isActive: openState) {
    const { height } = this.state
    if (isActive === openState.Opening || isActive === openState.Closing) {
      return `${height}px`
    }
    if (isActive === openState.Closed) {
      return 0
    }
    return 'auto'
  }

  render() {
    const { title, renderTitleBlock, children, hasLine, largeChevron, backgroundColor } = this.props
    const { isOpen } = this.state

    const containerStyle = {
      height: this.returnHeightValue(isOpen),
    }

    const itemLayoutClassnames = classnames('category-item-layout', { line: hasLine })
    const chevronClassnames = classnames({
      '-active': isOpen === openState.Opening || (isOpen === openState.Opened && ' -active'),
      chevron: true,
    })
    const accordionContainerClassnames = classnames('accordion-container', {
      'background-color': !!backgroundColor,
    })

    return (
      <li className="category-item">
        {/* Full width hit area */}
        <button className="category-item-link" type="button" onClick={this.handleCategoryClick}>
          {/* Grid layout doesn't play well with button, so use an extra div */}
          <div className={itemLayoutClassnames}>
            {/* Title */}
            <div className="title-wrapper">
              {renderTitleBlock ? (
                renderTitleBlock()
              ) : (
                <span className="title">
                  <Text size="body">{title}</Text>
                </span>
              )}
            </div>

            {/* Chevron Icon */}
            <div className="chevron-wrapper">
              <span className={chevronClassnames}>
                <Chevron large={largeChevron} />
              </span>
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        <div className={accordionContainerClassnames} style={containerStyle}>
          <div className="accordion-wrapper" ref={this.accordionWrapper}>
            {isOpen !== openState.Closed && children}
          </div>
        </div>
        <style jsx>
          {`
            .category-item {
              display: grid;
            }

            .line {
              border-bottom: 1px solid $ui-gray;
            }

            .category-item-link {
              text-decoration: none;
              cursor: pointer;
              user-select: none;
              padding: 0 var(--header-navigation-compact-px, 0);
            }

            .category-item-layout {
              display: grid;
              align-items: center;
              grid-template-columns: auto 10px;
              align-items: center;
            }

            .title-wrapper {
              grid-column: 1;
            }

            .chevron-wrapper {
              grid-column: 2;
              justify-self: end;
              align-self: center;
            }

            .chevron {
              display: inline-block;
              margin: 0 0 0 16px;
              transition: transform 0.3s;
              vertical-align: middle;
            }

            .chevron.-active {
              transform: rotate(-180deg);
            }

            .accordion-container {
              overflow: hidden;
              height: 0;
              transition: height ${TIMING.FAST}ms;
            }

            .accordion-wrapper {
              padding-top: var(--accordion-wrapper-py, 0);
              padding-bottom: var(--accordion-wrapper-py, 18px);
            }

            .title {
              display: block;
              color: ${Color.Black};
              padding: 18px 0;
            }

            .background-color {
              background-color: ${backgroundColor};
            }
          `}
        </style>
      </li>
    )
  }
}
