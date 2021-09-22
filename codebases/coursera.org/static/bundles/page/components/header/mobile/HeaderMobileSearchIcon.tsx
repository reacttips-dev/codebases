import React from 'react';
import _t from 'i18n!nls/page';
import MagnifierSvg from 'bundles/browse/components/PageHeader/MagnifierSvg';
import TrackedButton from 'bundles/page/components/TrackedButton';

type Props = {
  fill: string;
  onClick: () => void;
};

const HeaderMobileSearchIcon = (props: Props) => {
  return (
    <TrackedButton
      className="mobile-search-icon"
      trackingName="mobile_search_icon"
      onClick={props.onClick}
      style={{ border: 'none', backgroundColor: 'transparent' }}
      data={{ name: 'search-icon' }}
      aria-label={_t('Search Coursera')}
    >
      <MagnifierSvg fill={props.fill} />
    </TrackedButton>
  );
};

export default HeaderMobileSearchIcon;
