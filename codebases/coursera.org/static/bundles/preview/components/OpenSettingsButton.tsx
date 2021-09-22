import React from 'react';
import { Button } from '@coursera/coursera-ui';
import { SvgSetting } from '@coursera/coursera-ui/svg';

import 'css!bundles/preview/components/__styles__/OpenSettingsButton';

type Props = {
  onClick: () => void;
};

const OpenSettingsButton: React.SFC<Props> = ({ children, onClick }) => (
  <div className="rc-OpenSettingsButton">
    <Button type="noStyle" onClick={onClick}>
      {children}
      <div className="settings-icon-container">
        <SvgSetting size={24} color="#757575" hoverColor="#2A73CC" />
      </div>
    </Button>
  </div>
);

export default OpenSettingsButton;
