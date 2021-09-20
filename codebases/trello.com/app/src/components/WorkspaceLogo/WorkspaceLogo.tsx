import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import styles from './WorkspaceLogo.less';
import { logoDomain } from '@trello/config';
import { WorkspaceDefaultLogo } from './WorkspaceDefaultLogo';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('workspace_navigation');

export const WorkspaceLogo = ({
  logoHash,
  name,
  logoClassName = '',
}: {
  logoHash?: string | null;
  name: string;
  logoClassName?: string;
}) => {
  const [showPNG, setShowPNG] = useState(true);
  const [showDefaultLogo, setShowDefaultLogo] = useState(false);
  const logoExt = showPNG ? 'png' : 'gif';

  useEffect(() => {
    setShowPNG(true);
    setShowDefaultLogo(false);
  }, [logoHash]);
  return (
    <div
      className={classnames(styles.logoContainer, {
        [logoClassName]: !!logoClassName,
      })}
    >
      {logoHash && !showDefaultLogo ? (
        <img
          className={classnames(styles.workspaceLogo, {
            [logoClassName]: !!logoClassName,
          })}
          src={`${logoDomain}/${logoHash}/30.${logoExt}`}
          srcSet={`${logoDomain}/${logoHash}/30.${logoExt} 1x, ${logoDomain}/${logoHash}/170.${logoExt} 2x`}
          alt={format('logo-for-team', { name: name })}
          // eslint-disable-next-line react/jsx-no-bind
          onError={() => {
            showPNG ? setShowPNG(false) : setShowDefaultLogo(true);
          }}
        />
      ) : (
        <WorkspaceDefaultLogo name={name} />
      )}
    </div>
  );
};
