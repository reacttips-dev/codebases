import PropTypes from 'prop-types';
import { Link } from 'react-router';

import SmallProductCard from 'zen/components/common/SmallProductCard';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { useCountdownTimer } from 'hooks/useCountdownTimer';
import { formatAMPM } from 'helpers/TimeUtils';

import css from 'styles/components/landing/releaseCalendar.scss';

const imgDimensions = 211;
const type = 'flexvsimple';

export const ReleaseItem = ({ time, cta, link, price, style, product, src, retina, onComponentClick, shouldLazyLoad, slotIndex }) => {
  const cardData = { brandName: product, productName: style, srcUrl: src, retinaUrl: retina, price };
  const parsedTime = new Date(time);
  const releaseTime = useCountdownTimer(time);

  return (
    <article>
      {releaseTime && (
        <>
          <p className={css.timeTop}>
            {parsedTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} <span>@ {formatAMPM(parsedTime, { trimMins: true, trimSpace: true, amPmLowerCase: true })}</span>
          </p>
          <time dateTime={parsedTime.toISOString()} className={css.timeCountdown}>{releaseTime.d}d|{releaseTime.h}h|{releaseTime.m}m|{releaseTime.s}s</time>
        </>
      )}
      <SmallProductCard
        productClass={css.product}
        shouldLazyLoad={shouldLazyLoad}
        overrideContainer={'div'}
        type={type}
        cardData={cardData}
        msaImageDimensions={imgDimensions}
        threeSixtyDimensions={imgDimensions}/>
      {link ? <Link
        className={css.cta}
        data-eventlabel="ReleaseCalendar"
        data-eventvalue={`${product}-${style}`}
        data-slotindex={slotIndex}
        onClick={onComponentClick}
        to={link}>{cta}</Link> :
        !!cta && <p className={css.cta}>{cta}</p>
      }
    </article>
  );
};

ReleaseItem.contextTypes = {
  testId: PropTypes.func
};

export const ReleaseCalendar = props => {
  const {
    slotName,
    slotDetails: { item: items, monetateId },
    onComponentClick,
    shouldLazyLoad
  } = props;

  return (
    <div className={css.container} data-slot-id={slotName} data-monetate-id={monetateId}>
      {items.map(props => <ReleaseItem
        {...props}
        key={props.product + props.style}
        shouldLazyLoad={shouldLazyLoad}
        onComponentClick={onComponentClick} />)}
    </div>
  );
};

ReleaseCalendar.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('ReleaseCalendar', ReleaseCalendar);
