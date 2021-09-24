import React from 'react';
import styled from 'styled-components';
import { Icon } from '@glitchdotcom/shared-components';

const PrivacyIcon = styled(Icon)`
  margin-right: 5px;
  width: 15px;
  height: 15px;
`;

const privacyIconProps = {
  public: { icon: 'globe', alt: 'Public project' },
  private_code: { icon: 'lockCode', alt: 'Private code project' },
  private_project: { icon: 'lock', alt: 'Private project' },
};
export default function ProjectVisibilityIcon({ privacy }) {
  return <PrivacyIcon {...privacyIconProps[privacy]} />;
}
