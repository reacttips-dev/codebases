import { ChooseMember } from 'app/src/components/ChooseMember';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import React, { ComponentProps, useCallback } from 'react';
import { Util } from 'app/scripts/lib/util';
import { Analytics } from '@trello/atlassian-analytics';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

interface OptionsV2 {
  title: string;
  toggleSource: string;
  getCardMembers: (this: unknown) => Member[];
  getBoardMembers: (this: unknown) => Member[];
  getInitialMember: () => string | undefined | null;
  setMember: (value: string | null) => void;
}

function PopOverContents({
  getInitialMember,
  setMember,
  getCardMembers,
  getBoardMembers,
}: Pick<
  OptionsV2,
  'getInitialMember' | 'setMember' | 'getCardMembers' | 'getBoardMembers'
>) {
  const idMemberInitial = getInitialMember();

  const onSelect: ComponentProps<typeof ChooseMember>['onSelect'] = useCallback(
    (member) => {
      PopOver.hide();

      if (member && member.id !== idMemberInitial) {
        setMember(member.id);
      } else if (!member && idMemberInitial) {
        setMember(null);
      }
    },
    [idMemberInitial, setMember],
  );

  return (
    <>
      <ChooseMember
        {...{
          idMemberInitial,
          getCardMembers,
          getBoardMembers,
        }}
        onSelect={onSelect}
      />
    </>
  );
}

export function toggleAssignPopoverV2({
  setMember,
  getCardMembers,
  getBoardMembers,
  getInitialMember,
  title,
  toggleSource,
}: OptionsV2) {
  return function toggle(e: MouseEvent) {
    Util.stop(e);

    Analytics.sendClickedButtonEvent({
      buttonName: 'checkItemMemberButton',
      source: 'cardDetailScreen',
      attributes: {
        toggleSource: toggleSource,
      },
    });

    PopOver.toggle({
      elem: e.currentTarget,
      getViewTitle: () => title,
      keepEdits: true,
      reactElement: (
        <ErrorBoundary
          tags={{
            ownershipArea: 'trello-panorama',
            feature: Feature.Checklists,
          }}
        >
          <React.Fragment key="choose-member">
            <PopOverContents
              {...{
                setMember,
                getCardMembers,
                getBoardMembers,
                getInitialMember,
              }}
            />
          </React.Fragment>
        </ErrorBoundary>
      ),
    });
  };
}

interface Member {
  id: string;
  fullName: string;
  username: string;
}
