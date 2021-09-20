import React, {
  Suspense,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Button } from '@trello/nachos/button';
import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo';
import uuid from 'uuid/v4';
import cx from 'classnames';
import { Key } from '@trello/keybindings';
import { forTemplate, localizeCount } from '@trello/i18n';
import { useLazyComponent } from '@trello/use-lazy-component';

import styles from './GoldPromoFreeTrial.less';
import { Analytics } from '@trello/atlassian-analytics';
import { Spinner } from '@trello/nachos/spinner';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';

const format = forTemplate('gold_promo_page');

// Following listbox implementation from
// https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
// TODO: separate listbox hook implementation for a11y

interface ListboxItemProps {
  id: string;
  selected: boolean;
  index: number;
  onClick: React.MouseEventHandler;
  logoHash?: string | null;
  displayName: string;
  memberCount: number;
  boardCount: number;
}

const ListboxItem: React.FC<ListboxItemProps> = ({
  id,
  selected,
  logoHash,
  displayName,
  memberCount,
  boardCount,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selected]);

  return (
    <div
      key={id}
      className={cx(styles.listItemContainer, selected && styles.selected)}
      role="option"
      onClick={onClick}
      aria-selected={selected}
      ref={ref}
    >
      <div className={styles.listItem}>
        <div className={styles.avatar}>
          <WorkspaceLogo logoHash={logoHash} name={displayName} />
        </div>
        <div className={styles.text}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.info}>
            {localizeCount('members', memberCount)}.{' '}
            {localizeCount('boards', boardCount)}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

const NoWorkspaces: React.FC = () => {
  const [showCreateWorkspaceOverlay, setCreateWorkspaceOverlay] = useState(
    false,
  );
  const openCreateWorkspaceOverlay = useCallback(
    () => setCreateWorkspaceOverlay(true),
    [setCreateWorkspaceOverlay],
  );
  const closeCreateTeamOverlay = useCallback(
    () => setCreateWorkspaceOverlay(false),
    [setCreateWorkspaceOverlay],
  );

  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "gamma-create-team-overlay" */ 'app/gamma/src/components/overlays/create-team-overlay'
      ),

    {
      preload: false,
    },
  );

  return (
    <div className={styles.noWorkspaces}>
      <div>
        <div className={styles.noWorkspacesText}>
          {format('no-eligible-workspaces')}
        </div>
        <Button onClick={openCreateWorkspaceOverlay}>
          {format('create-workspace')}
        </Button>
        {showCreateWorkspaceOverlay && (
          <Suspense fallback={null}>
            <CreateWorkspaceOverlay
              onClose={closeCreateTeamOverlay}
              teamType={TeamType.Default}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};
interface ListboxProps {
  labelId: string;
  setOrgId: React.Dispatch<React.SetStateAction<string | null>>;
  workspaces: MappedWorkspace[];
}
const Listbox: React.FC<ListboxProps> = ({ workspaces, setOrgId, labelId }) => {
  // Positional index required for navigation
  const [selectedItemIndex, selectItemByIndex] = useState<number>(-1);

  // Search and filtering
  const [searchText, setSearchText] = useState('');
  const filteredWorkspaces = !searchText
    ? workspaces
    : workspaces.filter(({ displayName }) =>
        displayName.toLowerCase().includes(searchText.toLowerCase()),
      );
  const filteredWorkspacesLength = filteredWorkspaces.length;
  const showSearchBox = filteredWorkspacesLength > 7 || searchText;

  // Listbox navigation
  const goToItem = useCallback(
    (index: number) => {
      selectItemByIndex(index);
      setOrgId(index === -1 ? null : filteredWorkspaces[index].id);
    },
    [selectItemByIndex, setOrgId, filteredWorkspaces],
  );
  const resetSelectedItem = useCallback(() => goToItem(-1), [goToItem]);
  const navigateItems = useCallback(
    (direction: 1 | -1) => {
      const maxIndex = filteredWorkspacesLength - 1;
      const nextIndex = selectedItemIndex + direction;

      if (!filteredWorkspacesLength || nextIndex <= -1) {
        return;
      }

      if (nextIndex <= maxIndex) {
        goToItem(nextIndex);
      }
    },
    [filteredWorkspacesLength, selectedItemIndex, goToItem],
  );
  const selectNextItem = useCallback(() => navigateItems(1), [navigateItems]);
  const selectPrevItem = useCallback(() => navigateItems(-1), [navigateItems]);

  // Callbacks
  const searchOnChangeCallback = useCallback<
    React.FormEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSearchText(value.trim());
      resetSelectedItem();
    },
    [setSearchText, resetSelectedItem],
  );
  const searchKeyDownCallback = useCallback<React.KeyboardEventHandler>(
    (e) => {
      switch (e.key) {
        case Key.ArrowDown:
          e.preventDefault();
          selectNextItem();
          break;
        case Key.ArrowUp:
          e.preventDefault();
          selectPrevItem();
          break;
        default:
      }
    },
    [selectNextItem, selectPrevItem],
  );
  const listboxKeyDownCallback = useCallback<React.KeyboardEventHandler>(
    (e) => {
      switch (e.key) {
        case Key.ArrowDown:
          e.preventDefault();
          selectNextItem();
          break;
        case Key.ArrowUp:
          e.preventDefault();
          selectPrevItem();
          break;
        case Key.Home:
          e.preventDefault();
          goToItem(0);
          break;
        case Key.End:
          e.preventDefault();
          goToItem(filteredWorkspacesLength - 1);
          break;
        default:
      }
    },
    [selectNextItem, selectPrevItem, goToItem, filteredWorkspacesLength],
  );
  const listboxFocusCallback = useCallback<React.FormEventHandler>(() => {
    if (filteredWorkspacesLength && selectedItemIndex === -1) {
      goToItem(0);
    }
  }, [filteredWorkspacesLength, selectedItemIndex, goToItem]);

  return !workspaces.length ? (
    <NoWorkspaces />
  ) : (
    <>
      {showSearchBox && (
        <div className={styles.searchInputContainer}>
          <input
            type="search"
            aria-label={format('search-workspaces')}
            placeholder={format('search-workspaces')}
            onChange={searchOnChangeCallback}
            onKeyDown={searchKeyDownCallback}
            className={styles.searchInput}
          />
        </div>
      )}
      <div
        className={styles.listbox}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={0}
        onKeyDown={listboxKeyDownCallback}
        onFocus={listboxFocusCallback}
      >
        {!filteredWorkspaces.length
          ? format('no-boards-found')
          : filteredWorkspaces.map(
              (
                { id, logoHash, displayName, memberCount, boardCount },
                index,
              ) => {
                const selected = index === selectedItemIndex;

                return (
                  <ListboxItem
                    {...{
                      selected,
                      index,
                      id,
                      logoHash,
                      displayName,
                      onClick: () => goToItem(index),
                      memberCount,
                      boardCount,
                      key: id,
                    }}
                  />
                );
              },
            )}
      </div>
    </>
  );
};

interface MappedWorkspace {
  id: string;
  logoHash?: string | null;
  displayName: string;
  name: string;
  boardCount: number;
  memberCount: number;
}

interface GoldPromoProps {
  addingTrial: boolean;
  startGoldFreeTrial: ({
    orgId,
    orgName,
  }: {
    orgId: string;
    orgName: string;
  }) => Promise<void>;
  workspaces: MappedWorkspace[];
}

export const GoldPromoFreeTrial: React.FC<GoldPromoProps> = ({
  startGoldFreeTrial,
  addingTrial,
  workspaces,
}) => {
  const [selectedOrgId, setOrgId] = useState<string | null>(null);
  const selectedOrgName =
    workspaces.find(({ id }) => id === selectedOrgId)?.name || '';

  const onClickMainCTA = useCallback(() => {
    if (selectedOrgId) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'workspaceMenuItem',
        source: 'goldPromoFreeTrialScreen',
        attributes: {
          selectedOrgId,
        },
      });
      startGoldFreeTrial({
        orgId: selectedOrgId,
        orgName: selectedOrgName,
      });
    }
  }, [startGoldFreeTrial, selectedOrgId, selectedOrgName]);

  const titleId = uuid();

  return (
    <div className={styles.container}>
      <h1 className={styles.title} id={titleId}>
        {format('title')}
      </h1>
      <div className={styles.subText}>{format('subtext')}</div>

      <div>
        <div className={styles.listBoxContainer}>
          <Listbox
            labelId={titleId}
            setOrgId={setOrgId}
            workspaces={workspaces}
          />
        </div>
        {workspaces.length ? (
          addingTrial ? (
            <Spinner inline />
          ) : (
            <Button
              appearance="primary"
              isDisabled={!selectedOrgId}
              onClick={onClickMainCTA}
            >
              {format('start-free-trial')}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
};
