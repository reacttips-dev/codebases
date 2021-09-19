import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { onEvent, supportsPassiveEventListener } from 'helpers/EventHelpers';

import css from 'styles/components/common/melodyCarousel.scss';

export const createPages = (itemWidths, itemsContainerWidth) => {
  const [pagesAcc, lastPage] = itemWidths.reduce(([allPages, thisPage], itemWidth, i) => {
    const wouldBeWidth = calcPageWidth(thisPage, itemWidths) + itemWidth;
    if (wouldBeWidth > itemsContainerWidth) {
      // too wide for this page, so must go into next page
      return [allPages.concat([thisPage]), [i]];
    } else {
      return [allPages, thisPage.concat([i])];
    }
  }, [[], []]);

  return pagesAcc.concat([lastPage]);
};

export const calcPageWidth = (pageItems, itemWidths) => pageItems.reduce((acc, item) => acc + itemWidths[item], 0);

export const calcEmptySpace = (pageItems, itemWidths, itemsContainerWidth) => itemsContainerWidth - calcPageWidth(pageItems, itemWidths);

export const computeMargins = (item, win = window) => {
  const { marginLeft, marginRight } = win.getComputedStyle(item);
  return parseInt(marginLeft, 10) + parseInt(marginRight, 10);
};

const computeWidth = item => item.getBoundingClientRect().width;

// computeMargins() will only be called on the first item to save cycles
export const computeItemWidths = (items, calcMargins = computeMargins) => {
  let margin = null;
  return items.reduce((widthAcc, item) => {
    if (margin === null) {
      margin = calcMargins(item);
    }
    return widthAcc.concat([computeWidth(item) + margin]);
  }, []);
};

class MelodyCarousel extends Component {
  static contextTypes = {
    testId: PropTypes.func
  };

  state = {
    currentIndex: 0
  };

  componentDidMount() {
    const { handleResize, handleTouchMove, setItemData, props: { children, onDidMount, slideIndex, reconfigure } } = this;
    if (children.length > 0) {
      setItemData();
    }

    if (slideIndex) {
      this.setState({ currentIndex: slideIndex });
    }

    if (reconfigure) {
      this.handleResize(); // Taking advantage of debounce.
    }

    const opts = supportsPassiveEventListener() ? { passive: true } : false;
    onEvent(window, 'resize', handleResize, opts, this);
    onEvent(window, 'resize', handleTouchMove, opts, this);
    onDidMount && onDidMount();
  }

  componentDidUpdate({ reconfigureNonce: prevReconfigureNonce }) {
    const { reconfigureNonce } = this.props;
    if (reconfigureNonce && reconfigureNonce !== prevReconfigureNonce) {
      // the parent indicated that something changed, so reconfigure
      this.debouncedReconfigure();
    }
  }

  setIndex = newIndex => {
    const {
      props: { snap, afterSlide },
      state: { pageCount = 1, pages = [] } // Sometimes `pageCount` can be undefined causing `newIndex` to be NaN.
    } = this;

    newIndex = Math.max(0, Math.min(newIndex, pageCount - 1));
    if (snap) {
      snap(this, newIndex);
    }

    // Note this will fire on the initial "setup"/mounting of the component, so prepare accordingly
    if (afterSlide) {
      afterSlide(newIndex, pages[newIndex] || []);
    }
    this.setState({ currentIndex: newIndex });
  };

  setItemData = () => {
    const { state: { currentIndex }, itemsContainer } = this;
    const itemsContainerWidth = computeWidth(itemsContainer);
    const itemWidths = computeItemWidths(Array.from(itemsContainer.children));
    const pages = createPages(itemWidths, itemsContainerWidth);
    const pageCount = pages.length;
    this.setState({
      currentIndex: Math.min(currentIndex, pageCount - 1),
      pageCount,
      itemsContainerWidth,
      pages,
      itemWidths
    });
  };

  debouncedReconfigure = debounce(() => {
    this.reconfigure();
  }, 100);

  handleResize = this.debouncedReconfigure;

  handleTouchMove = () => {
    // ios10 scrolling fix (i.e. preventDefault() on touchmove doesn't stop vertical scrolling when swiping per https://github.com/timruffles/ios-html5-drag-drop-shim/issues/77)
  };

  makeArrows = () => {
    const {
      props: { classes, showArrows, arrowStyleOverrides, children },
      state: { currentIndex, pageCount },
      context: { testId = f => f },
      setIndex
    } = this;

    if (showArrows && pageCount > 1 && children.length > 1) {
      return [
        <button
          type="button"
          key="prev"
          ref={el => this.prev = el}
          style={arrowStyleOverrides}
          className={cn(css.prev, classes.prevButton, { [css.inactive]: currentIndex === 0 })}
          onClick={() => setIndex(currentIndex - 1)}
          data-test-id={testId('prevArrow')}>
          Previous
        </button>,
        <button
          type="button"
          key="next"
          ref={el => this.next = el}
          style={arrowStyleOverrides}
          className={cn(css.next, classes.nextButton, { [css.inactive]: currentIndex >= pageCount - 1 })}
          onClick={() => setIndex(currentIndex + 1)}
          data-test-id={testId('nextArrow')}>
          Next
        </button>
      ];
    }
  };

  makeDots = () => {
    const {
      props: { dotLabels = [], showDots },
      state: { currentIndex, pageCount },
      context: { testId = f => f },
      setIndex
    } = this;
    if (showDots && pageCount > 1) {
      return (
        <div className={css.paging}>
          {Array(pageCount).fill(undefined).map((_, index) => (
            <button
              type="button"
              key={index}
              className={cn({ [css.active]: index === currentIndex })}
              onClick={() => setIndex(index)}
              tabIndex={0}
              data-test-id={testId('carouselPageDot')}
            >
              {dotLabels[index] || index + 1}
            </button>
          ))}
        </div>
      );
    }
  };

  reconfigure = () => {
    const {
      state: { currentIndex },
      setIndex, setItemData,
      itemsContainer,
      props: { children }
    } = this;

    if (!itemsContainer) {
      return null;
    }

    if (children.length > 0) {
      setItemData();
      setIndex(currentIndex);
    }
  };

  swipe = event => {
    const { itemsContainer, mCarousel, setIndex } = this;
    let xStart = null;
    let yStart = null;
    let xEnd = null;
    let yEnd = null;
    let xDiff = null;
    let yDiff = null;
    const leftStart = itemsContainer.offsetLeft || 0; // starting point in px
    const leftOrig = itemsContainer.style.left; // original left value (could be px, %, em, rem, furlong, mile, league?) so we can reset if needed
    const threshold = 50; // the minimum distance needed to call the function
    const distance = 15; // the minimum distance to determine if x or y swipe
    let direction;
    const opts = supportsPassiveEventListener() ? { passive: true } : false;

    const start = e => {
      xStart = e.touches[0].clientX;
      yStart = e.touches[0].clientY;
    };

    const move = e => {
      if (xStart === null || yStart === null) {
        return;
      }

      xEnd = e.touches[0].clientX;
      yEnd = e.touches[0].clientY;

      xDiff = xStart - xEnd;
      yDiff = yStart - yEnd;

      const leftDiff = leftStart - xDiff;

      if (!direction) {
        if (Math.abs(xDiff) > distance) {
          direction = 'x';
        } else if (Math.abs(yDiff) > distance) {
          direction = 'y';
        }
      }

      if (direction === 'x') {
        e.stopPropagation();
        itemsContainer.style.left = `${leftDiff}px`;
      }
    };

    const end = e => {
      itemsContainer.classList.remove(css.swiping);

      if (direction === 'x') {
        // x movement greater than y movement so activate rotation
        const dir = xDiff > 0 ? 1 : -1;

        if (Math.abs(xDiff) >= threshold) {
          setIndex(this.state.currentIndex + dir);

        } else {
          restore(e);
        }
      } else {
        // restore original left position since y movement greater than x movement
        restore(e);
      }

      mCarousel.removeEventListener('touchmove', move);
      mCarousel.removeEventListener('touchend', end);
    };

    const restore = () => {
      itemsContainer.style.left = leftOrig;
    };

    start(event);

    itemsContainer.classList.add(css.swiping);

    onEvent(mCarousel, 'touchmove', move, opts, this);
    onEvent(mCarousel, 'touchend', end, opts, this);
  };

  render() {
    const { pageCount } = this;
    const { buttonsOutsideItemsViewport, children, classes, padScrollArea, showDots, title, ItemsWrappingElement } = this.props;

    const outerClass = cn(
      { [css.padScrollArea]: padScrollArea && pageCount > 1, [css.showDots]: showDots },
      css.mCarouselWrapper
    );
    if (children.length > 0) {
      const itemsContainerMarkup = (
        <ItemsWrappingElement ref={el => this.itemsContainer = el} className={cn(css.items, classes.itemsContainer)}>
          {children}
        </ItemsWrappingElement>
      );

      return (
        <div className={css.mCarousel}>
          {title && <h2 className={css.heading}>{title}</h2>}
          <div ref={el => this.mCarousel = el} className={outerClass} onTouchStart={this.swipe}>
            {buttonsOutsideItemsViewport
              ? <div className={cn(css.itemsViewport, classes.itemsViewport)}>{itemsContainerMarkup}</div>
              : itemsContainerMarkup
            }
          </div>
          {this.makeArrows()}
          {this.makeDots()}
        </div>
      );
    }
    return null;
  }
}

MelodyCarousel.snap = {
  none: carousel => {
    const {
      state: { pages, itemWidths, itemsContainerWidth },
      itemsContainer
    } = carousel;
    const allPages = pages.reduce((acc, page) => acc.concat(page), []);
    const maxLeft = calcPageWidth(allPages, itemWidths) - itemsContainerWidth;
    const currentLeft = parseFloat(itemsContainer.style.left);
    const newLeft = Math.min(0, Math.max(currentLeft, maxLeft * -1)) + 'px';
    itemsContainer.style.left = newLeft;
  },

  page: (carousel, newIndex) => {
    const {
      state: { itemsContainerWidth, pageCount, pages, itemWidths },
      itemsContainer
    } = carousel;

    if (typeof newIndex === 'undefined' || !itemsContainer) {
      return;
    }

    const targetPage = newIndex + 1;

    if (targetPage === 1) {
      // let css's default rules handle first page
      itemsContainer.style.left = '';
      return;
    }

    // page 2 or higher
    let previousPageWidths = 0;

    for (let i = 1; i < targetPage; i++) {
      previousPageWidths += calcPageWidth(pages[i - 1], itemWidths);
    }

    let leftPos = -(previousPageWidths) + 'px';

    if (targetPage >= pageCount) {
      // don't show whitespace if last page doesn't fill up all available slots
      const extraSpace = calcEmptySpace(pages[targetPage - 1], itemWidths, itemsContainerWidth);
      if (extraSpace > 0) {
        leftPos = `calc(${leftPos} + ${extraSpace}px`;
      }
    }

    itemsContainer.style.left = leftPos;
  }
};

MelodyCarousel.defaultProps = {
  buttonsOutsideItemsViewport: false,
  classes: {
    itemsViewport: '',
    prevButton: '',
    nextButton: ''
  },
  padScrollArea: true,
  showDots: true,
  showArrows: true,
  snap: MelodyCarousel.snap.page,
  ItemsWrappingElement: 'div'
};

MelodyCarousel.propTypes = {
  buttonsOutsideItemsViewport: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  classes: PropTypes.shape({
    itemsViewport: PropTypes.string,
    prevButton: PropTypes.string,
    nextButton: PropTypes.string
  }),
  dotLables: PropTypes.array,
  padScrollArea: PropTypes.bool,
  /** A value which, when it changes, causes the component to reconfigure including re-calculating page widths */
  reconfigureNonce: PropTypes.any,
  showDots: PropTypes.bool,
  showArrows: PropTypes.bool,
  snap: PropTypes.func,
  title: PropTypes.string,
  onDidMount: PropTypes.func
};

export default MelodyCarousel;
