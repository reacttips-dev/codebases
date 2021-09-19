import { Link } from 'react-router';

import SizeGroupsSlider from './SizeGroupsSlider';

import { constructMSAImageUrl } from 'helpers';
import { trackEvent } from 'helpers/analytics';
import ImageLazyLoader from 'components/common/ImageLazyLoader';

import css from 'styles/components/productdetail/sizeGroups.scss';

const imagePlaceholder = <div className={css.cardImagePlaceholder} />;

const makeFullProductName = ({ productNameWithoutSizeGroup }, { sizeGroupName }) => `${productNameWithoutSizeGroup} (${sizeGroupName})`;

const makeGroupCardImageSrc = ({ imageId }, sizeCoeff) => {
  const width = 113 * sizeCoeff;
  const height = 80 * sizeCoeff;
  return constructMSAImageUrl(imageId, { width, height });
};

const makeGroupCardImage = (props, sizeGroup) => {
  const imgProps = {
    className: css.cardImage,
    src: makeGroupCardImageSrc(sizeGroup, 1),
    alt: makeFullProductName(props, sizeGroup),
    srcSet: `${makeGroupCardImageSrc(sizeGroup, 2)} 2x`
  };
  return <ImageLazyLoader imgProps={imgProps} placeholder={imagePlaceholder} />;
};

const makePriceEl = ({ basePrice, salePrice }) => {
  let priceClassName = '';
  let basePriceEl = null;
  if (basePrice !== salePrice) {
    priceClassName = css.salePrice;
    basePriceEl = <span className={css.basePrice}>&nbsp;MSRP:&nbsp;{basePrice}</span>;
  }
  return (
    <div className={css.price}>
      <span className={priceClassName}>{salePrice}</span>{basePriceEl}
    </div>
  );
};

const makeGroupCardText = ({ productNameWithoutSizeGroup }, sizeGroup) => {
  const { sizeGroupName } = sizeGroup;
  return (
    <div className={css.cardText}>
      <div className={css.productName}>{productNameWithoutSizeGroup}</div>
      <div className={css.groupName}>{sizeGroupName}</div>
      {makePriceEl(sizeGroup)}
    </div>
  );
};

const makeGroupCard = (props, sizeGroup, index) => {
  const { seoUrl, styleId } = sizeGroup;
  const trackSizeGroupEvent = () => trackEvent('TE_PDP_SIZEBREAKRECOMMENDATION', styleId);
  return (
    <div key={index} className={css.groupCardWrapper}>
      <Link to={seoUrl} className={css.groupCard} onClick={trackSizeGroupEvent}>
        {makeGroupCardImage(props, sizeGroup)}
        {makeGroupCardText(props, sizeGroup)}
      </Link>
    </div>
  );
};

const makeGroupCards = (props, groups) => {
  const cardEls = groups.map((group, i) => makeGroupCard(props, group, i));
  const sliders = [
    <SizeGroupsSlider
      key="mobile"
      mobile={true}
      groups={groups}
      cards={cardEls} />,
    <SizeGroupsSlider
      key="desktop"
      mobile={false}
      groups={groups}
      cards={cardEls} />
  ];
  return <div className={css.groupCards}>{sliders}</div>;
};

const makeComponent = (props, groups) => (
  <div className={css.container}>
    <h2 className={css.heading}>Other Sizes in This Style</h2>
    {makeGroupCards(props, groups)}
  </div>
);

const currentGroupList = ({ currentColorId, groupListsByColorId, hasSizeGroups }) => (hasSizeGroups ? groupListsByColorId[currentColorId] : undefined);

const SizeGroups = props => {
  const groups = currentGroupList(props);
  return groups ? makeComponent(props, groups) : null;
};

export default SizeGroups;
