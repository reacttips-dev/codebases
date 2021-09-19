import { Link } from 'react-router';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import LandingPageImage from 'components/landing/LandingPageImage';

import commonCardCss from 'styles/components/common/melodyCard.scss';
import css from 'styles/components/common/melodyCardCategory.scss';

const MelodyCardCategory = ({ cardData, altCss: { featureCss, imgCss } = {}, eventLabel, onComponentClick, noBackground, melodyCardTestId, shouldLazyLoad, slotIndex, bottomAligned, children }) => {
  const {
    msaImageUrl,
    image,
    name,
    alt,
    link,
    title,
    gae
  } = cardData;

  const { testId } = useMartyContext();

  return (
    <article className={cn(commonCardCss.mCard, css.melodyCardCategory)}>
      <Link
        to={link}
        onClick={evt => onComponentClick(evt, cardData)}
        data-eventlabel={eventLabel}
        data-eventvalue={gae}
        data-slotindex={slotIndex}
        data-test-id={testId(melodyCardTestId)}>
        <div className={cn(
          commonCardCss.image,
          css.categoryImage,
          { [commonCardCss.imageNoBackground]: noBackground },
          { [imgCss]: imgCss },
          { [css.bottomAligned] : bottomAligned }
        )}>
          <LandingPageImage
            src={msaImageUrl || image}
            alt={alt}
            title={title}
            shouldLazyLoad={shouldLazyLoad}
          />
        </div>
        <div className={cn(css.categoryContent, { [featureCss]: featureCss })}>
          <p className={css.categoryName}>{name}</p>
        </div>
        { children }
      </Link>
    </article>
  );
};

export default MelodyCardCategory;
