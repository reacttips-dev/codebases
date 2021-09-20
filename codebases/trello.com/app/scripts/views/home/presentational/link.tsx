import React from 'react';

import styles from './link.less';
import { SectionHeader } from './section-header';
import {
  Tile,
  TileButtonIcon,
  TileIcon,
  TileLink,
  TileLinkText,
  TileText,
} from './tile';

interface LinkListProps {
  links: {
    onClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
    iconName: string;
    isButton?: boolean;
    text: string;
    url?: string;
  }[];
}
export const LinkList: React.FunctionComponent<LinkListProps> = ({ links }) => (
  <>
    {links.map(({ onClick, iconName, isButton, text, url }, index) => (
      <Tile key={index}>
        <TileLink url={url} onClick={onClick} isButton={isButton}>
          {isButton ? (
            <TileButtonIcon name={iconName} />
          ) : (
            <TileIcon name={iconName} />
          )}
          <TileText>
            <TileLinkText>{text}</TileLinkText>
          </TileText>
        </TileLink>
      </Tile>
    ))}
  </>
);

interface LinkSectionProps {
  sectionHeaderTitle: string;
  links: {
    onClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
    iconName: string;
    isButton?: boolean;
    text: string;
    url?: string;
  }[];
}
export const LinkSection: React.FunctionComponent<LinkSectionProps> = ({
  sectionHeaderTitle,
  links,
}) => (
  <div className={styles.linkSection}>
    <SectionHeader>{sectionHeaderTitle}</SectionHeader>
    <LinkList links={links} />
  </div>
);
