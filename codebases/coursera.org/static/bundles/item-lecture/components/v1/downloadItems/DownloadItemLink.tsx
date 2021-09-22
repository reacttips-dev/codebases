import React from 'react';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import { spacing } from '@coursera/coursera-ui';

type Props = {
  trackingName: string;
  onClick?: () => void;
  data?: { [dataAttribute: string]: string | number };
  href: string;
  target?: string;
  rel?: string;
  title: string;
  children: JSX.Element | JSX.Element[];
  download?: string;
};

const DownloadItemLink = ({ trackingName, onClick, data, href, target, children, download, rel }: Props) => {
  return (
    <li className="menuitem">
      <TrackedA
        data={data}
        href={href}
        role="menuitem"
        target={target}
        onClick={onClick}
        download={download}
        trackingName={trackingName}
        style={{ padding: `${spacing.sm} ${spacing.lg}` }}
        className="menuitem"
        rel={rel}
      >
        {children}
      </TrackedA>
    </li>
  );
};

export default DownloadItemLink;
