import { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { stripSpecialChars } from 'helpers';
import MelodyModal from 'components/common/MelodyModal';
import NotificationSignup from 'components/landing/NotificationSignup.jsx';
import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyPromoGroup.scss';

const makeKey = (prefix, suffix) => `${stripSpecialChars(prefix)}_${suffix}`;

export class MelodyPromoGroup extends Component {

  state = {
    modalIndex: null
  };

  componentDidMount() {
    const { slotName, slotIndex, slotDetails } = this.props;
    const { promos, componentName } = slotDetails;
    promos.forEach(promo => {
      track(() => ([
        evHeroImpression,
        { slotName, slotIndex, slotDetails: promo, heroCount: promos.length, name: componentName }
      ]));
    });
  }

  onPromoClick = (evt, promo) => {
    const { onComponentClick, slotDetails: { promos, componentName }, slotIndex, slotName } = this.props;
    onComponentClick && onComponentClick(evt);
    track(() => ([
      evHeroClick,
      { slotName, slotIndex, slotDetails: promo, heroCount: promos.length, name: componentName }
    ]));
  };

  toggleModal = evt => {
    const i = evt.target.dataset?.modalIndex;
    this.setState({ modalIndex: +i });
    const { onComponentClick } = this.props;
    onComponentClick && onComponentClick(evt);
  };

  render() {
    const { modalIndex } = this.state;
    const { slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad } = this.props;
    const { testId } = this.context;
    const { promos, heading, monetateId, variant } = slotDetails;
    const exactlyTwoPromos = promos.length === 2;
    const isCenterAlignText = typeof variant === 'string' && variant.toLowerCase().includes('centeraligntext');
    const isMobileGrid = typeof variant === 'string' && variant.toLowerCase().includes('mobilegrid');

    const promoGroup = promos.map((singlePromo, i) => {
      const { action, actionheading, alt, brandalt, brandid, brandsrc, copy, cta, gae, heading, promotag, src, subtext, url } = singlePromo;
      const isPopup = action === 'popup';
      const linkProps = {
        'onClick': evt => this.onPromoClick(evt, singlePromo),
        'data-eventlabel': 'melodyPromoGroup',
        'data-eventvalue': gae || alt,
        'data-slotindex': slotIndex,
        'key': makeKey(url, i),
        'className': cn(css.promo, { [css.exactlyTwoPromos]: exactlyTwoPromos, [css.isCenterAlignText]: isCenterAlignText, [css.mobileGridPromo]: isMobileGrid })
      };

      const makeImage = () => {
        const imageProps = { src, alt, shouldLazyLoad, imgTestId: testId('melodyPromoContentImg') };
        const promoImg = <LandingPageImage {...imageProps} />;

        if (promotag || isPopup) {
          const testIdName = isPopup ? 'melodyPromoGroupProductReleaseContainer' : 'melodyPromoGroupPromoTag';

          return (<div className={css.imgContainer} data-test-id={testId(testIdName)}>
            {promotag && <p>{promotag}</p>}
            {promoImg}
          </div>);
        } else if (isMobileGrid) {
          return (
            <div className={css.mobileGridImageContainer}>
              <div className={css.mobileGridProductImage}>
                {promoImg}
              </div>
            </div>
          );
        } else {
          return promoImg;
        }
      };

      const buttonData = {
        eventlabel: 'closeButton',
        eventvalue: cta
      };

      const contents = (
        <section key={makeKey(heading, i)}>
          {makeImage()}

          {brandid && <MelodyModal
            isOpen={modalIndex === i}
            buttonData={buttonData}
            buttonTestId="closeModal"
            onRequestClose={this.toggleModal}
            className={css.modalContent}
            heading={actionheading || 'Shoe Release Reminder'}
            shouldCloseOnOverlayClick={true}
          >
            <NotificationSignup
              toggleModal={this.toggleModal}
              onTaxonomyComponentClick={onComponentClick}
              slotDetails={slotDetails}
              componentStyle="promoGroupModal"
              listId={brandid}
              id={brandid}
              imageUrl={src}
              alt={alt}
            />
          </MelodyModal>}

          <section className={css.bottom}>
            {
              brandsrc && <div className={css.brandimg}><img src={brandsrc} alt={brandalt}/></div>
            }
            <div className={css.content}>
              {heading && <h3 data-test-id={testId('melodyPromoContentHeading')}>{heading}</h3>}
              {copy && <HtmlToReact className={css.copy}>{copy}</HtmlToReact>}
              {subtext && <p className={css.subtext}>{subtext}</p>}
              {action === 'popup' ? <button
                onClick={this.toggleModal}
                data-modal-index={i}
                className={css.cta}
                type="button"
                data-eventlabel={cta}
                data-eventvalue={gae || alt}
                data-test-id={testId('openModal')}>{cta}</button> : <p
                className={css.cta}
                data-test-id={testId('melodyPromoContentCta')}>{cta}</p>}
            </div>
          </section>
        </section>
      );

      if (isPopup) {
        return <div className={cn(css.promo, { [css.exactlyTwoPromos]: exactlyTwoPromos, [css.isCenterAlignText]: isCenterAlignText })} key={`${actionheading}_${brandid}`}>{contents}</div>;
      } else {
        return (
          <LandingPageLink
            key={url}
            url={url}
            fallbackNode="div"
            {...linkProps}
          >
            {contents}
          </LandingPageLink>
        );
      }
    });

    return (
      <div className={cn(css.promoGroupContainer, { [css.exactlyTwoPromos]: exactlyTwoPromos })} data-slot-id={slotName} data-monetate-id={monetateId}>
        {heading && <h2>{heading}</h2>}
        <div className={cn(css.promos, { [css.mobileGridPromoGroup]: isMobileGrid })}>
          {promoGroup}
        </div>
      </div>
    );
  }
}

MelodyPromoGroup.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('MelodyPromoGroup', MelodyPromoGroup);
