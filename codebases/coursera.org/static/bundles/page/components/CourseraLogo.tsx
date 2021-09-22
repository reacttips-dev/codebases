import React from 'react';
import classNames from 'classnames';

import { getBase64 } from 'bundles/page/lib/logo';
import { REBRAND_COLORS } from 'bundles/front-page/components/modules/buttons/sharedStyles';
import _t from 'i18n!nls/page';

const SRC_PREFIX = 'data:image/svg+xml;base64,';

type Props = {
  hexColorCode?: string;
  ariaHidden?: boolean;
  className?: string;
  imgSrc?: string;
};

/**
 * React component for generating the Coursera logo statically without making a network call
 */
const CourseraLogo: React.FC<Props> = ({
  hexColorCode = REBRAND_COLORS.BLUE,
  ariaHidden = false,
  imgSrc = SRC_PREFIX + getBase64(hexColorCode),
  className,
}) => {
  return (
    <img
      src={imgSrc}
      className={classNames('rc-CourseraLogo', className)}
      alt={_t('Coursera')}
      aria-hidden={ariaHidden}
    />
  );
};

export default CourseraLogo;
