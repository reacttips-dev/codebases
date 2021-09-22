import React from 'react';

import user from 'js/lib/user';
import Imgix from 'js/components/Imgix';

import DefaultUserLogo from 'bundles/program-common/components/DefaultUserLogo';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/admin-v2';

import 'css!./__styles__/MyCourseraButton';

export type ContextProps = {
  tabIndex?: number;
  onKeyDown?: () => void;
  targetRef?: () => void;
};

const MyCourseraButton = ({ tabIndex, onKeyDown, targetRef }: ContextProps) => {
  const { photo_120: photoUrl, fullName } = user.get();
  const contexts: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  contexts.push({
    href: '/?skipBrowseRedirect=true',
    header: _t('My Coursera'),
    showLabel: true,
    photoUrl,
  });

  const href = '/?skipBrowseRedirect=true';
  const header = _t('My Coursera');
  const label = fullName;

  return (
    <li key="my-coursera-button" className="rc-MyCourseraButton">
      <TrackedA
        aria-label={label}
        href={href}
        id={`${header}-link`}
        role="menuitem"
        trackingName="header_right_nav_button"
        data={{ label }}
        tabIndex={tabIndex || 0}
        onKeyDown={onKeyDown}
        refAlt={targetRef}
      >
        <div className="photo-container">
          {photoUrl && <Imgix alt={_t('Organization logo')} src={photoUrl} width={32} height={32} />}
          {!photoUrl && <DefaultUserLogo size={32} />}
        </div>

        {label && (
          <div className="text-container">
            <div>{header}</div>
            <div className="organization-name">{label}</div>
          </div>
        )}
        {!label && <div>{header}</div>}
      </TrackedA>
    </li>
  );
};

export default MyCourseraButton;
