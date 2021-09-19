import MelodyCarousel from 'components/common/MelodyCarousel';

import css from 'styles/components/productdetail/sizeGroupsSlider.scss';

const makeDesktopSlider = ({ cards, mobile }) => {
  const returnArrowOverrideObj = { top: '49%' };

  return <MelodyCarousel showDots={mobile} arrowStyleOverrides={returnArrowOverrideObj}>{cards}</MelodyCarousel>;
};

const SizeGroupsSlider = props => {
  const className = props.mobile ? css.mobileSlider : css.desktopSlider;
  return <div className={className}>{makeDesktopSlider(props)}</div>;
};

export default SizeGroupsSlider;
