import React from 'react';
import HeaderHelpLink from 'bundles/author-common/components/HeaderHelpLink';

import 'css!bundles/preview/components/__styles__/PreviewHelp';

const PreviewHelp: React.FC = () => {
  return (
    <div className="rc-PreviewHelp">
      <HeaderHelpLink />
    </div>
  );
};

export default PreviewHelp;
