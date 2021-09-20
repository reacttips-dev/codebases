import React, { AnchorHTMLAttributes, CSSProperties } from 'react';
import cx from 'classnames';
import { useLightText, N0, N800, TrelloBlue500 } from '@trello/colors';
import { CanonicalCard } from '@trello/test-ids';
import TrelloIcon from '../icons/TrelloIcon';
import { Board as BaseBoard, BoardProps } from '../board';
import styles from './BoardCard.less';
import cardStyles from '../card-front/Card.less';
import actionPanelStyles from './ActionPanel.less';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  linkComponent?: React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
}

const NameUrl: React.FC<LinkProps> = ({
  linkComponent: LinkComponent,
  ...props
}) => {
  if (LinkComponent) {
    return <LinkComponent className={styles.nameUrl} {...props} />;
  }
  return <a className={styles.nameUrl} {...props} />;
};

interface ListNameSectionProps {
  displayLogo?: boolean;
}

const ListNameSection: React.FC<ListNameSectionProps> = ({
  displayLogo,
  children,
}) => (
  <div className={cx(styles.nameSection, displayLogo && styles.displayLogo)}>
    {children}
  </div>
);

const TeamBoardAndListNameSection = ListNameSection; //.extend``;
const BoardAndListNameSection = ListNameSection; //.extend``;

const TrelloLogo: React.FC = (props) => (
  <span className={styles.trelloLogo} {...props}>
    <TrelloIcon height={16} width={16} />
  </span>
);

export const Board: React.FC<BoardProps> = ({
  children,
  className,
  ...boardProps
}) => {
  const boardClasses = cx(
    styles.board,
    cardStyles.boardCard,
    actionPanelStyles.boardCard,
    className,
    boardProps.headerBgColor && styles.headerBgColor,
  );

  const bgColor =
    boardProps.headerBgColor || boardProps.bgColor || TrelloBlue500;
  const style: CSSProperties = {
    color: useLightText(bgColor) ? N0 : N800,
  };

  return (
    <BaseBoard className={boardClasses} {...boardProps} style={style}>
      {children}
    </BaseBoard>
  );
};

interface ListNameOnlyProps extends ListNameSectionProps {
  listName: string;
}

export const ListNameOnly: React.FC<ListNameOnlyProps> = ({
  listName,
  ...props
}) => (
  <ListNameSection {...props}>
    <div className={styles.listName}>{listName}</div>
  </ListNameSection>
);

interface BoardAndListNameProps {
  boardName?: string;
  boardUrl?: string;
  displayLogo?: boolean;
  listName?: string;
  linkComponent?: React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export const BoardAndListName: React.FC<BoardAndListNameProps> = ({
  boardName,
  boardUrl,
  displayLogo = false,
  listName,
  linkComponent,
  ...props
}) => (
  <BoardAndListNameSection displayLogo={displayLogo} {...props}>
    {displayLogo && <TrelloLogo />}
    <div className={styles.boardName} data-test-class={CanonicalCard.BoardName}>
      {boardUrl ? (
        <NameUrl href={boardUrl} linkComponent={linkComponent}>
          {boardName}
        </NameUrl>
      ) : (
        boardName
      )}
      {listName ? ':' : null}
      &nbsp;
    </div>
    <div className={styles.listName} data-test-class={CanonicalCard.ListName}>
      {listName}
    </div>
  </BoardAndListNameSection>
);

interface TeamBoardAndListNameProps extends ListNameSectionProps {
  boardName?: string;
  boardUrl?: string;
  teamName?: string;
  teamUrl?: string;
  listName?: string | null;
  title?: string; // TODO: Doesn't appear to be used, but is being passed in
  onClick?: () => void;
  linkComponent?: React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export const TeamBoardAndListName: React.FC<TeamBoardAndListNameProps> = ({
  boardName,
  boardUrl,
  teamName,
  teamUrl,
  displayLogo = false,
  listName,
  onClick,
  linkComponent,
  ...props
}) => (
  <TeamBoardAndListNameSection displayLogo={displayLogo} {...props}>
    {displayLogo && <TrelloLogo />}
    <div className={styles.teamName}>
      {teamUrl ? (
        <NameUrl href={teamUrl} linkComponent={linkComponent}>
          {teamName}
        </NameUrl>
      ) : (
        teamName
      )}
      {teamName ? ' |' : null}
      &nbsp;
    </div>
    <div className={styles.boardName}>
      {boardUrl ? (
        <NameUrl
          href={boardUrl}
          onClick={onClick}
          linkComponent={linkComponent}
        >
          {boardName}
        </NameUrl>
      ) : (
        boardName
      )}
      {listName ? ':' : null}
      &nbsp;
    </div>
    <div className={styles.listName}>{listName}</div>
  </TeamBoardAndListNameSection>
);
