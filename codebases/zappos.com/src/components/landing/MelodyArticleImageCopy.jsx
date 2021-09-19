import HtmlToReact from 'components/common/HtmlToReact';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageImage from 'components/landing/LandingPageImage';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/melodyArticleImageCopy.scss';

function makeImageContents(slotDetails, onComponentClick, shouldLazyLoad, slotIndex) {
  const { src, link, alt, gae, copy } = slotDetails;
  const linkProps = {
    'onClick': onComponentClick,
    'data-eventlabel': 'melodyArticleImageCopy',
    'data-eventvalue': gae,
    'data-slotindex': slotIndex
  };
  const contents = (
    <>
      <LandingPageImage src={src} alt={alt} shouldLazyLoad={shouldLazyLoad} />
      {copy && <p className={css.copy}>{copy}</p>}
    </>
  );
  return link
    ?
    <LandingPageLink url={link} {...linkProps}>
      {contents}
    </LandingPageLink>
    :
    contents;
}

export const MelodyArticleImageCopy = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }) => {
  const { heading, body, monetateId, subtitle } = slotDetails;
  return (
    <div
      className={css.wrap}
      data-slot-id={slotName}
      data-monetate-id={monetateId}
    >
      <div className={css.imgWrap}>
        {makeImageContents(slotDetails, onComponentClick, shouldLazyLoad, slotIndex)}
      </div>
      <div className={css.contentWrap}>
        {heading && <h2 className={css.heading}>{heading}</h2>}
        {subtitle && <h3 className={css.subtitle}>{subtitle}</h3>}
        <HtmlToReact>{body}</HtmlToReact>
      </div>
    </div>
  );
};

export default withErrorBoundary('MelodyArticleImageCopy', MelodyArticleImageCopy);
