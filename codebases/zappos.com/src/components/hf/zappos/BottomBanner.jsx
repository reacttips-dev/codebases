import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Link from 'components/hf/HFLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';
import useEvent from 'hooks/useEvent';
import { evGlobalBannerClick, evGlobalBannerImpression } from 'events/headerFooter';
import { track } from 'apis/amethyst';
import { trackEvent as defaultTrackEvent } from 'helpers/analytics';
import { NON_ALPHA_NUMERIC_RE_GEN } from 'common/regex';

import css from 'styles/components/hf/zappos/bottomBanner.scss';

const justifyContentStyleMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

export const BottomBanner = ({ dismissGlobalBanner, globalBanner, trackEvent = defaultTrackEvent }) => {
  const { data, isDismissed } = globalBanner;

  const ref = useRef();
  const [contentRef, setContentRef] = useState();

  useEffect(() => {
    if (!globalBanner.isDismissed && globalBanner.data) {
      track(() => ([evGlobalBannerImpression, { globalBanner, text: ref.current?.innerText }]));
    }
  }, [globalBanner]);

  const onClick = e => {
    if (e.target.tagName === 'A') {
      const { textContent, href } = e.target;
      const { gae = 'GlobalBanner-Default' } = ref.current?.dataset || {};

      track(() => ([evGlobalBannerClick, {
        globalBanner,
        text: ref.current?.textContent,
        linkText: textContent,
        linkUrl: href,
        isDismiss: false
      }]));

      const uniqueGaeValue = `${gae}-${textContent.replace(NON_ALPHA_NUMERIC_RE_GEN(), '')}`;
      trackEvent('TE_GLOBAL_BANNER_LINK_CLICK', uniqueGaeValue);
    }
  };

  useEvent(ref?.current, 'click', onClick);

  if (!data || isDismissed) {
    return null;
  }

  const {
    heading, content, href, linktext,
    disableDismiss = false, gae, backgroundColor,
    textAlign, contentWidth, color
  } = data;

  const onDismiss = () => {
    dismissGlobalBanner(gae);
    track(() => ([evGlobalBannerClick, {
      globalBanner,
      text: ref.current?.innerText,
      linkText: 'Close banner',
      shoppableLink: false,
      isDismiss: false
    }]));
  };

  const styleBg = { backgroundColor };
  const style = {
    textAlign,
    justifyContent: justifyContentStyleMap[textAlign],
    width: contentWidth,
    color
  };
  const isDismissable = disableDismiss?.toString() !== 'true';

  // Allowing all HTML tags except what's explicitly below in the RegEx.
  const stripRegEx = /<(\/?|!?)(p|div|article|section)>/g;
  const updatedContent = content.replace(stripRegEx, '');

  return (
    <div style={styleBg} className={css.container}>
      <div
        style={style}
        ref={ref}
        className={cn(css.innerContainer, { [css.hasDismiss]: isDismissable })}
        data-gae={gae}>
        {heading && <h2>{heading}</h2>}
        <HtmlToReact className={css.content} ref={ref => setContentRef(ref)}>{updatedContent}</HtmlToReact>
        {(href && linktext && contentRef) && ReactDOM.createPortal(<Link className={css.cta} to={href}>{linktext}</Link>, contentRef)}
        {isDismissable && <button
          className={css.dismiss}
          type="button"
          onClick={() => onDismiss()}
          aria-label="Close banner"/>}
      </div>
    </div>
  );
};

BottomBanner.propTypes = {
  dismissGlobalBanner: PropTypes.func.isRequired,
  globalBanner: PropTypes.shape({
    heading: PropTypes.string,
    content: PropTypes.string,
    href: PropTypes.string,
    linktext: PropTypes.string,
    disableDismiss: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    gae: PropTypes.string,
    backgroundColor: PropTypes.string,
    textAlign: PropTypes.string,
    contentWidth: PropTypes.string,
    color: PropTypes.string,
    isDismissed: PropTypes.bool
  })
};

const BottomBannerWithErrorBoundary = withErrorBoundary('BottomBanner', BottomBanner);
export default BottomBannerWithErrorBoundary;
