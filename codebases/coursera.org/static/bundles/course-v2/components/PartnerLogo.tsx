import React from 'react';
import Imgix from 'js/components/Imgix';

import 'css!./__styles__/PartnerLogo';

type Props = {
  thumbnail: string;
  altText: string;
};

const PartnerLogo = (props: Props) => {
  const { thumbnail, altText } = props;
  return <Imgix className="rc-PartnerLogo bgcolor-white bt3-hidden-xs" src={thumbnail} alt={altText} />;
};

export default PartnerLogo;
