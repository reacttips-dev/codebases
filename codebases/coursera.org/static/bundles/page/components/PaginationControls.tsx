import React from 'react';
import classNames from 'classnames';
import Uri from 'jsuri';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import range from 'lodash/range';

import TrackedButton from 'bundles/page/components/TrackedButton';
import { NotFoundError } from 'bundles/ssr/lib/errors/directives';

import { SvgChevronLeft, SvgChevronRight } from '@coursera/coursera-ui/svg';

import Retracked from 'js/lib/retracked';

import _t from 'i18n!nls/page';
import { isRightToLeft } from 'js/lib/language';

import 'css!bundles/page/components/__styles__/PaginationControls';

const COLLAPSE_THRESHOLD = 2;

export class RightArrow extends React.Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    renderLink: PropTypes.bool,
    ariaLabel: PropTypes.string,
    largeStyle: PropTypes.bool,
    algoliaCreatePaginateLink: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    componentDidMount: false,
  };

  handleClick = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pageCount' does not exist on type 'Reado... Remove this comment to see the full error message
    const { pageCount, currentPage, onPageChange } = this.props;
    if (currentPage !== pageCount) {
      onPageChange(currentPage + 1);
    }
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderLink' does not exist on type 'Read... Remove this comment to see the full error message
    const { renderLink, currentPage, pageCount, ariaLabel, largeStyle, algoliaCreatePaginateLink } = this.props;
    const { componentDidMount } = this.state;
    const { router } = this.context;
    const disabled = currentPage === pageCount;
    const classes = classNames('label-text box arrow', {
      'arrow-disabled': disabled,
    });
    const isRtl = isRightToLeft(_t.getLocale());
    const Chevron = isRtl ? SvgChevronLeft : SvgChevronRight;
    const ariaLabelDefault = isRtl ? _t('Previous Page') : _t('Next Page');
    const dataE2e = isRtl ? 'pagination-controls-previous' : 'pagination-controls-next';
    const trackingName = isRtl ? 'pagination_left_arrow' : 'pagination_right_arrow';
    const cifChevronClass = isRtl ? 'cif-chevron-left' : 'cif-chevron-right';

    const icon = largeStyle ? <Chevron size={15} color="rgb(255, 255, 255)" /> : <i className={cifChevronClass} />;

    if (!renderLink || disabled) {
      return (
        <TrackedButton
          data-e2e={dataE2e}
          trackingName={trackingName}
          onClick={this.handleClick}
          className={classes}
          disabled={disabled}
          aria-label={ariaLabel || ariaLabelDefault}
        >
          {icon}
        </TrackedButton>
      );
    } else if (algoliaCreatePaginateLink) {
      // need traditional anchor tags for link pagination with algolia to work
      const destinationUrl = new Uri()
        .setPath(router.location.pathname)
        .setQuery(algoliaCreatePaginateLink(currentPage + 1));

      return (
        <a className={classes} href={destinationUrl.toString()} aria-label={ariaLabel}>
          {icon}
        </a>
      );
    } else {
      const destinationUrl = new Uri().setPath(router.location.pathname).setQuery(router.location.search);
      if (destinationUrl.hasQueryParam('page')) {
        // replaceQueryParam underlying implementation relies on native decodeURIComponent function
        // decodeURIComponent will throw an error if the url is malformed
        // Ex: /directory/videos?param=&page=2 is not a valid url, because query param separator "&" is preceded by "=", and decodeURIComponent will throw an error.
        // Since this is a JS error, and we don't want the whole page to 500, we want to return 404 instead.
        try {
          destinationUrl.replaceQueryParam('page', currentPage + 1);
        } catch (err) {
          if (!componentDidMount) {
            throw new NotFoundError();
          }
        }
      } else {
        destinationUrl.addQueryParam('page', currentPage + 1);
      }

      return (
        <Link className={classes} to={destinationUrl.toString()} aria-label={ariaLabel}>
          {icon}
        </Link>
      );
    }
  }
}

export class LeftArrow extends React.Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    renderLink: PropTypes.bool,
    ariaLabel: PropTypes.string,
    largeStyle: PropTypes.bool,
    algoliaCreatePaginateLink: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    ariaHidden: false,
  };

  state = {
    componentDidMount: false,
  };

  handleClick = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentPage' does not exist on type 'Rea... Remove this comment to see the full error message
    const { currentPage, onPageChange } = this.props;
    if (currentPage !== 1) {
      onPageChange(currentPage - 1);
    }
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderLink' does not exist on type 'Read... Remove this comment to see the full error message
    const { renderLink, currentPage, ariaLabel, largeStyle, algoliaCreatePaginateLink } = this.props;
    const { componentDidMount } = this.state;
    const { router } = this.context;
    const disabled = currentPage === 1;
    const classes = classNames('label-text box arrow', {
      'arrow-disabled': disabled,
    });
    const isRtl = isRightToLeft(_t.getLocale());
    const Chevron = isRtl ? SvgChevronRight : SvgChevronLeft;
    const dataE2e = isRtl ? 'pagination-controls-next' : 'pagination-controls-prev';
    const trackingName = isRtl ? 'pagination_right_arrow' : 'pagination_left_arrow';
    const ariaLabelDefault = isRtl ? _t('Next Page') : _t('Previous Page');
    const cifChevronClass = isRtl ? 'cif-chevron-right' : 'cif-chevron-left';

    const icon = largeStyle ? <Chevron size={15} color="rgb(255, 255, 255)" /> : <i className={cifChevronClass} />;
    const prevPageNumber = currentPage - 1;
    const firstPageNumber = 1;

    if (!renderLink || disabled) {
      return (
        <TrackedButton
          data-e2e={dataE2e}
          trackingName={trackingName}
          onClick={this.handleClick}
          className={classes}
          disabled={disabled}
          aria-label={ariaLabel || ariaLabelDefault}
        >
          {icon}
        </TrackedButton>
      );
    } else if (algoliaCreatePaginateLink) {
      // need traditional anchor tags for link pagination with algolia to work
      const destinationUrl = new Uri()
        .setPath(router.location.pathname)
        .setQuery(algoliaCreatePaginateLink(prevPageNumber));

      return (
        <a className={classes} href={destinationUrl.toString()} aria-label={ariaLabel}>
          {icon}
        </a>
      );
    } else {
      const destinationUrl = new Uri().setPath(router.location.pathname).setQuery(router.location.search);
      if (destinationUrl.hasQueryParam('page')) {
        try {
          if (prevPageNumber === firstPageNumber) {
            destinationUrl.deleteQueryParam('page');
          } else {
            destinationUrl.replaceQueryParam('page', prevPageNumber);
          }
        } catch (err) {
          if (!componentDidMount) {
            throw new NotFoundError();
          }
        }
      } else {
        destinationUrl.addQueryParam('page', prevPageNumber);
      }

      return (
        <Link className={classes} to={destinationUrl.toString()} aria-label={ariaLabel}>
          {icon}
        </Link>
      );
    }
  }
}

class NumberBox extends React.Component {
  static propTypes = {
    num: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool.isRequired,
    onPageChange: PropTypes.func,
    renderLink: PropTypes.bool,
    algoliaCreatePaginateLink: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    componentDidMount: false,
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  handleClick = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isCurrent' does not exist on type 'Reado... Remove this comment to see the full error message
    const { isCurrent, onPageChange, num } = this.props;
    if (!isCurrent) {
      onPageChange(num);
    }
  };

  render() {
    const { router } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'num' does not exist on type 'Readonly<{}... Remove this comment to see the full error message
    const { num, isCurrent, renderLink, algoliaCreatePaginateLink } = this.props;
    const { componentDidMount } = this.state;
    const classes = classNames('box number', { current: isCurrent });
    const ariaLabel = _t('Page ' + num);
    const firstPageNumber = 1;

    if (!renderLink) {
      const buttonAriaLabel = isCurrent ? _t('Selected page: ' + ariaLabel) : ariaLabel;
      return (
        <TrackedButton
          id={`pagination_number_box_${num}`}
          data-e2e="pagination-number-box"
          trackingName={`pagination_number_box_${num}`}
          data={{ pageNum: num }}
          onClick={this.handleClick}
          className={classes}
          aria-label={buttonAriaLabel}
        >
          {num}
        </TrackedButton>
      );
    } else if (algoliaCreatePaginateLink) {
      // need traditional anchor tags for link pagination with algolia to work
      const destinationUrl = new Uri().setPath(router.location.pathname).setQuery(algoliaCreatePaginateLink(num));

      return (
        <a
          className={classes}
          href={destinationUrl.toString()}
          aria-label={ariaLabel}
          style={isCurrent ? { pointerEvents: 'none' } : {}}
        >
          {num}
        </a>
      );
    } else {
      const destinationUrl = new Uri().setPath(router.location.pathname).setQuery(router.location.search);
      // Needs to be in try / catch b/c it will break if url has a malformed URL (cause of decodeURIComponent which is used in these helpers)
      try {
        if (num === firstPageNumber) {
          destinationUrl.deleteQueryParam('page');
        } else {
          destinationUrl.replaceQueryParam('page', num);
        }
      } catch (err) {
        if (!componentDidMount) {
          throw new NotFoundError();
        }
      }

      return (
        <Link
          className={classes}
          to={destinationUrl.toString()}
          aria-label={ariaLabel}
          style={isCurrent ? { pointerEvents: 'none' } : {}}
        >
          {num}
        </Link>
      );
    }
  }
}

class Ellipsis extends React.Component {
  render() {
    return <span className="ellipsis">…</span>;
  }
}
class PaginationControls extends React.Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    // maxPages controls how many numbers before we turn into ellipses.
    // e.g `currentPage = 1, maxPages = 3, pageCount = 10` then we have `1, 2, 3, ELIPSES , 10`
    maxPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    pageCount: PropTypes.number,
    centered: PropTypes.bool,
    renderLinks: PropTypes.bool,
    hideNumbers: PropTypes.bool,
    algoliaCreatePaginateLink: PropTypes.func, // for use with algolia instant search to render links with their specific query parameters
    largeStyle: PropTypes.bool, // style components to match the coursera-ui component
    style: PropTypes.object,
    paginationControlsStyle: PropTypes.object,
  };

  static defaultProps = {
    centered: false,
    pageCount: 1,
    style: {},
    paginationControlsStyle: {},
    renderLinks: false,
    hideNumbers: false,
  };

  componentWillMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentPage' does not exist on type 'Rea... Remove this comment to see the full error message
    const { currentPage } = this.props;
    if (currentPage < 1) {
      throw new Error('Current page cannot be zero or negative.');
    }
  }

  renderNumBox = (n: $TSFixMe, i: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onPageChange' does not exist on type 'Re... Remove this comment to see the full error message
    const { onPageChange, currentPage, renderLinks, algoliaCreatePaginateLink } = this.props;
    const num = n + 1;
    return (
      <NumberBox
        onPageChange={onPageChange}
        num={num}
        isCurrent={num === currentPage}
        key={num}
        renderLink={renderLinks}
        algoliaCreatePaginateLink={algoliaCreatePaginateLink}
      />
    );
  };

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pageCount' does not exist on type 'Reado... Remove this comment to see the full error message
      pageCount,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxPages' does not exist on type 'Readon... Remove this comment to see the full error message
      maxPages,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentPage' does not exist on type 'Rea... Remove this comment to see the full error message
      currentPage,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onPageChange' does not exist on type 'Re... Remove this comment to see the full error message
      onPageChange,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderLinks' does not exist on type 'Rea... Remove this comment to see the full error message
      renderLinks,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideNumbers' does not exist on type 'Rea... Remove this comment to see the full error message
      hideNumbers,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
      style,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'centered' does not exist on type 'Readon... Remove this comment to see the full error message
      centered,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'largeStyle' does not exist on type 'Read... Remove this comment to see the full error message
      largeStyle,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'paginationControlsStyle' does not exist ... Remove this comment to see the full error message
      paginationControlsStyle,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'algoliaCreatePaginateLink' does not exis... Remove this comment to see the full error message
      algoliaCreatePaginateLink,
    } = this.props;
    if (pageCount === 0) {
      return null;
    }
    let body; // - Format: 1 2 3 4 5
    if (pageCount <= maxPages) {
      body = range(pageCount).map(this.renderNumBox); // - Format: 1 2 3 4 ... 10
    } else if (currentPage <= maxPages - COLLAPSE_THRESHOLD) {
      body = [
        range(maxPages - 1).map(this.renderNumBox),
        <Ellipsis key="elip" />,
        <NumberBox
          onPageChange={onPageChange}
          num={pageCount}
          isCurrent={false}
          key={pageCount}
          renderLink={renderLinks}
          algoliaCreatePaginateLink={algoliaCreatePaginateLink}
        />,
      ]; // - Format: 1 ... 7 8 9 10
    } else if (currentPage >= pageCount - (maxPages - 1 - COLLAPSE_THRESHOLD)) {
      body = [
        <NumberBox
          onPageChange={onPageChange}
          num={1}
          isCurrent={false}
          renderLink={renderLinks}
          algoliaCreatePaginateLink={algoliaCreatePaginateLink}
        />,
        <Ellipsis />,
        range(pageCount - (maxPages - 1), pageCount).map(this.renderNumBox),
      ]; // - Format: 1 ... 3 4 5 ... 10
    } else {
      const midSize = maxPages - COLLAPSE_THRESHOLD;
      const start = currentPage - Math.floor(midSize / 2);
      const end = currentPage + Math.ceil(midSize / 2);
      body = [
        <NumberBox
          onPageChange={onPageChange}
          num={1}
          isCurrent={false}
          key={1}
          renderLink={renderLinks}
          algoliaCreatePaginateLink={algoliaCreatePaginateLink}
        />,
        <Ellipsis key="elip1" />,
        range(start, end).map(this.renderNumBox),
        <Ellipsis key="elip2" />,
        <NumberBox
          onPageChange={onPageChange}
          num={pageCount}
          isCurrent={false}
          key={pageCount}
          renderLink={renderLinks}
          algoliaCreatePaginateLink={algoliaCreatePaginateLink}
        />,
      ];
    }
    const className = classNames('rc-PaginationControls', 'horizontal-box', {
      'align-items-right': !centered,
      'align-items-absolute-center': centered,
      'large-style': largeStyle,
    });
    return (
      <div data-e2e="pagination-controls" className={className} style={{ ...style }}>
        <div
          role="navigation"
          className="pagination-controls-container"
          style={{ ...paginationControlsStyle }}
          aria-label="Page Navigation"
        >
          <LeftArrow
            onPageChange={onPageChange}
            currentPage={currentPage}
            renderLink={renderLinks}
            largeStyle={largeStyle}
            algoliaCreatePaginateLink={algoliaCreatePaginateLink}
          />
          {!hideNumbers && body}
          <RightArrow
            onPageChange={onPageChange}
            currentPage={currentPage}
            pageCount={pageCount}
            renderLink={renderLinks}
            largeStyle={largeStyle}
            algoliaCreatePaginateLink={algoliaCreatePaginateLink}
          />
        </div>
      </div>
    );
  }
}
// @ts-expect-error ts-migrate(2339) FIXME: Property 'currentPage' does not exist on type '{}'... Remove this comment to see the full error message
const TrackedPaginationControls = Retracked.createTrackedContainer(({ currentPage, maxPages, pageCount }) => {
  return {
    currentPage,
    maxPages,
    pageCount,
  };
})(PaginationControls);
export default TrackedPaginationControls;
