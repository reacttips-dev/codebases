import React from 'react';
import { usePopover, Popover } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { InformationIcon } from '@trello/nachos/icons/information';
import { isSubmitEvent } from '@trello/keybindings';
const format = forNamespace('home board section title');

export interface BoardListSectionPopover {
  className?: string;
}

export const BoardListGuestSectionPopover: React.FunctionComponent<BoardListSectionPopover> = ({
  className,
}) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLAnchorElement>();

  return (
    <>
      <a
        className={className}
        ref={triggerRef}
        onClick={toggle}
        // eslint-disable-next-line react/jsx-no-bind
        onKeyDown={(e) => {
          if (isSubmitEvent(e)) {
            toggle();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <InformationIcon size="medium" />
      </a>

      <Popover {...popoverProps} title={format('guest teams lowercase')}>
        <div>
          <p>
            {format('guest teams info', {
              learnMoreLink: (
                <a
                  href="https://help.trello.com/article/1236-board-guests"
                  target="_blank"
                  key="learnMoreGuestTeams"
                >
                  {format('learn more')}
                </a>
              ),
            })}
          </p>
        </div>
      </Popover>
    </>
  );
};
