import React from 'react';
import _t from 'i18n!nls/page';
import user from 'js/lib/user';
import { ChevronDownIcon, ChevronUpIcon } from '@coursera/cds-icons';

import 'css!./__styles__/NavigationHeader';

type Props = {
  header: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

const NavigationHeader = ({ header, label, isActive, onClick }: Props) => {
  const adminName = user.get().full_name;
  const ariaLabel = isActive
    ? _t('Admin dropdown menu for #{adminName}: open', { adminName })
    : _t('Admin dropdown menu for #{adminName}: closed', { adminName });

  return (
    <button
      type="button"
      className={`rc-NavigationHeader ${isActive ? 'active' : ''}`}
      aria-haspopup="true"
      aria-expanded={isActive}
      aria-label={ariaLabel}
      data-e2e="Navigation_Header"
      data-pendo-guide="NavigationHeader"
      onClick={onClick}
    >
      <div className="text-container">
        <strong>{header}</strong>
        <div className="navigation-label">{label}</div>
      </div>

      {isActive ? (
        <ChevronUpIcon size="small" color="interactive" />
      ) : (
        <ChevronDownIcon size="small" color="interactive" />
      )}
    </button>
  );
};

export default NavigationHeader;
