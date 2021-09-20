import React from 'react';
import { forTemplate } from '@trello/i18n';
import { CalendarIcon } from '@trello/nachos/icons/calendar';

import { Button } from '@trello/nachos/button';

const format = forTemplate('board_header');

interface CalendarBoardButtonProps {
  backgroundBrightness?: 'dark' | 'light';
  onClick: () => void;
}

export const CalendarBoardButton: React.FunctionComponent<CalendarBoardButtonProps> = ({
  backgroundBrightness,
  onClick,
}) => {
  return (
    <div>
      <Button
        style={{ margin: '0 4px 0 0' }}
        appearance={
          backgroundBrightness === 'dark' ? 'transparent' : 'transparent-dark'
        }
        iconBefore={<CalendarIcon />}
        onClick={onClick}
      >
        {format('calendar')}
      </Button>
    </div>
  );
};
