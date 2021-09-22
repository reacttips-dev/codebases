import React from 'react';
import 'css!bundles/preview/components/__styles__/Action';

type Props = {
  icon: JSX.Element;
  label: string;
  href?: string;
  onClick?: (x0: React.SyntheticEvent<HTMLElement>) => void;
  iconSize?: number;
};

const Action: React.SFC<Props> = ({ icon, label, href, onClick, iconSize }) => (
  <a className="rc-Action" href={href || '#'} onClick={onClick}>
    {React.cloneElement(icon, { size: iconSize || 24, color: '#2972d1' })}
    <span>{label}</span>
  </a>
);

export default Action;
