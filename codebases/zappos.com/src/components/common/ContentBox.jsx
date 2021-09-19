import { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageMedia from 'components/landing/LandingPageMedia';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';

import css from 'styles/components/common/contentBox.scss';

const getLinkClass = linkStyle => {
  switch (linkStyle) {
    case 'link-uppercase-bold':
      return css.linkUppercaseBold;
    default:
      return css.linkBtn;
  }
};

const flexAlignStyleMap = {
  left: 'flex-start', // this is default in the scss
  center: 'center',
  right: 'flex-end'
};

export const ContentBox = ({
  heading, HeadingTag = 'h2', copy, subCopy, className, children, imageData, links = [], onClick, eventLabel, linkStyle,
  useImageAsHeading, shouldLazyLoad, backgroundColor, color, textAlign, contentWidth
}) => {
  const { testId } = useMartyContext();

  // Check that we want to render the ContentBox first
  if (heading || copy || subCopy || imageData || links?.[0]?.text) {

    const style = {
      textAlign,
      backgroundColor,
      color,
      borderColor: color,
      alignItems: flexAlignStyleMap[textAlign],
      width: contentWidth
    };

    const headingStyle = {
      color
    };

    const hideHeadingForImg = useImageAsHeading && imageData?.alt;
    const ImgWrapper = hideHeadingForImg ? HeadingTag : Fragment;

    return (
      <div style={style} className={cn(css.container, className)} data-test-id={testId(`contentBox:${eventLabel || heading}`)}>
        <ImgWrapper>
          <LandingPageMedia {...imageData} shouldLazyLoad={shouldLazyLoad} />
        </ImgWrapper>
        {(heading && !hideHeadingForImg) && <HeadingTag className={css.heading} style={headingStyle}>{heading}</HeadingTag>}
        {copy && <HtmlToReact className={css.copy}>{copy}</HtmlToReact>}
        {subCopy && <HtmlToReact className={css.subCopy}>{subCopy}</HtmlToReact>}
        {children}
        {!!links.length && <div className={css.links} style={{ justifyContent: flexAlignStyleMap[textAlign] }}>
          {links.map(({ href, text, newWindow, gae }) =>
            <LandingPageLink
              className={getLinkClass(linkStyle)}
              onClick={onClick}
              newWindow={newWindow}
              url={href}
              key={href + text + gae}
              data-eventvalue={gae || text}
              data-eventlabel={eventLabel}>
              {text}
            </LandingPageLink>
          )}
        </div>}
      </div>
    );
  }

  return null;
};

ContentBox.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.string,
  HeadingTag: PropTypes.string,
  copy: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string,
    newWindow: PropTypes.bool,
    gae: PropTypes.string
  })),
  linkStyle: PropTypes.string,
  eventLabel: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  shouldLazyLoad: PropTypes.bool,
  useImageAsHeading: PropTypes.bool,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  textAlign: PropTypes.string,
  contentWidth: PropTypes.string,
  imageData: PropTypes.shape({
    type: PropTypes.string,
    sources: PropTypes.arrayOf(PropTypes.object),
    src: PropTypes.string,
    srcset: PropTypes.string,
    alt: PropTypes.string
  })
};

export default withErrorBoundary('ContentBox', ContentBox);
