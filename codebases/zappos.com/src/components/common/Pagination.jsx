import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { makePageLink } from 'helpers/SearchUtils';
import useMartyContext from 'hooks/useMartyContext';

import styles from 'styles/components/common/pagination.scss';

export function makeDesktopPages(props, context, args) {
  const { currentLocation, filters, totalPages } = props;
  const { testId, marketplace: { hasSeoTermPages } } = context;
  const { currentPageWithOffset, offset, onPaginationClick } = args;

  if (!totalPages || !(totalPages > 1)) {
    return;
  }

  const pages = [];
  if (totalPages <= 4) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
  } else if (currentPageWithOffset > 3 && currentPageWithOffset <= (totalPages - 3)) {
    pages.push(1, currentPageWithOffset - 2, currentPageWithOffset - 1, currentPageWithOffset, currentPageWithOffset + 1, totalPages);
  } else if (currentPageWithOffset > totalPages - 3) {
    pages.push(1);
    for (let i = totalPages - 3; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      pages.push(i + 1);
    }
    pages.push(totalPages);
  }

  return pages.map((page, i) => {
    const path = makePageLink(filters, currentLocation, page - offset, hasSeoTermPages);
    const linkEl = (
      <Link
        onClick={() => onPaginationClick(page)}
        key={`pageNum-${page}`}
        title={`Page ${page}`}
        data-test-id={testId('paginationNumber')}
        to={path}>
        {page}
      </Link>
    );
    const cont = <span key={`ellipsis-${page}`} className={styles.cont}>…</span>;
    if (page === currentPageWithOffset) {
      return (
        <span
          key={`currentPage-${page}`}
          aria-current="true"
          className={styles.selected}
          data-test-id={testId('currentPageDesktop')}>
          {currentPageWithOffset}
        </span>
      );
    } else if (i === 0 && currentPageWithOffset > 4 && totalPages > 5) {
      return [linkEl, cont];
    } else if ((i === 0 && currentPageWithOffset > 4 && totalPages > 5) || ((pages.length - 1 === i) && currentPageWithOffset < (totalPages - 3))) {
      return [cont, linkEl];
    } else {
      return linkEl;
    }
  });
}

export function makePrevNextLink(props, context, args) {
  const { currentLocation, filters, firstPageIndex, totalPages } = props;
  const { testId, marketplace: { hasSeoTermPages } } = context;
  const { currentPage, isPreviousLink, offset, onPaginationClick } = args;

  const atFirstPage = currentPage <= firstPageIndex;
  const atLastPage = currentPage >= totalPages - offset;
  const isDisabled = isPreviousLink ? atFirstPage : atLastPage;
  const targetPage = isPreviousLink ? currentPage - 1 : currentPage + 1;

  const linkText = <>{isPreviousLink ? 'Previous' : 'Next'} <span className={styles.pageText}> Page</span></>;

  const linkProps = {
    'className': cn(
      { [styles.disabled]: isDisabled },
      isPreviousLink ? styles.leftArrow : styles.rightArrow
    ),
    'disabled': isDisabled,
    'data-test-id': testId(isPreviousLink ? 'prevButton' : 'nextButton'),
    'onClick': () => onPaginationClick(`${targetPage + 1}:${isPreviousLink ? 'prev' : 'next'}`),
    'rel': isPreviousLink ? 'prev' : 'next'
  };
  if (!isDisabled) {
    linkProps.to = makePageLink(filters, currentLocation, targetPage, hasSeoTermPages);
  }
  return <Link {...linkProps}>{linkText}</Link>;
}

export const Pagination = props => {
  const {
    arrowNav, desktopStyled, firstPageIndex, onPagination, page, totalPages,
    useSearchPageStyles
  } = props;
  const context = useMartyContext();
  const { testId } = context;

  const currentPage = page <= firstPageIndex ? firstPageIndex : page;
  const offset = 1 - firstPageIndex;
  const currentPageWithOffset = currentPage + offset;

  // Track pagination interaction if onPagination callback provided
  const onPaginationClick = page => {
    if (onPagination && page) {
      onPagination(page);
    }
  };

  const renderFunctionArgs = { currentPage, currentPageWithOffset, offset, onPaginationClick };

  const wrapperStyles = cn(styles.pagination, {
    [styles.desktopStyled]: desktopStyled,
    [styles.arrowNav]: arrowNav,
    // eslint-disable-next-line css-modules/no-undef-class
    [styles.searchPagination]: useSearchPageStyles
  });

  return (
    <div className={wrapperStyles}>
      {makePrevNextLink(props, context, { ...renderFunctionArgs, isPreviousLink: true })}
      <div className={styles.compactContent} data-test-id={testId('currentPage')}>{`${currentPage + offset} of ${totalPages}`}</div>
      <span className={styles.fullContent}>
        {makeDesktopPages(props, context, renderFunctionArgs)}
      </span>
      {makePrevNextLink(props, context, { ...renderFunctionArgs, isPreviousLink: false })}
    </div>
  );
};

Pagination.displayName = 'Pagination';

Pagination.defaultProps = {
  arrowNav: false,
  desktopStyled: false,
  useSearchPageStyles: false
};

Pagination.propTypes = {
  arrowNav: PropTypes.bool,
  currentLocation: PropTypes.string,
  filters: PropTypes.object,
  firstPageIndex: PropTypes.number.isRequired,
  desktopStyled: PropTypes.bool,
  onPagination: PropTypes.func,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  useSearchPageStyles: PropTypes.bool
};

export default withErrorBoundary('Pagination', Pagination);
