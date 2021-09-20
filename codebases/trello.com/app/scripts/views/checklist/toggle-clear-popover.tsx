import { PopOver } from 'app/scripts/views/lib/pop-over';
import React, { Fragment, useCallback } from 'react';
import { Util } from 'app/scripts/lib/util';
import { Analytics } from '@trello/atlassian-analytics';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

const format = forTemplate('advanced_checklists');

interface Options {
  clear: () => void;
  message: string;
  removeText: string;
  title: string;
  upsell: boolean;
}

function PopOverContents({
  message,
  upsell,
  clear,
  removeText,
}: Pick<Options, 'message' | 'upsell' | 'removeText' | 'clear'>) {
  const onClickRemove = useCallback(() => {
    PopOver.hide();

    Analytics.sendClickedButtonEvent({
      buttonName: 'clearAdvancedChecklistSettingButton',
      source: 'clearAdvancedChecklistSettingsInlineDialog',
    });

    clear();
  }, [clear]);

  const onClickUpsell = useCallback(() => {
    PopOver.hide();

    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradeFromAdvancedChecklist',
      source: 'clearAdvancedChecklistSettingsInlineDialog',
    });

    window.open('/business-class');
  }, []);

  return (
    <>
      {upsell && (
        <p style={{ textAlign: 'center', padding: '12px 0' }}>{message}</p>
      )}
      <Button onClick={onClickRemove} shouldFitContainer={true}>
        {removeText}
      </Button>
      {upsell && (
        <Button onClick={onClickUpsell} shouldFitContainer={true}>
          {format('upgrade-to-business-class')}
        </Button>
      )}
    </>
  );
}

export function toggleClearPopover({
  clear,
  message,
  removeText,
  title,
  upsell,
}: Options) {
  return function toggle(e: MouseEvent) {
    Util.stop(e);

    Analytics.sendUIEvent({
      action: 'toggled',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'clearAdvancedChecklistInlineDialog',
      source: 'cardDetailScreen',
    });

    PopOver.toggle({
      elem: e.currentTarget,
      getViewTitle: () => title,
      keepEdits: true,
      reactElement: (
        <Fragment key={'clear'}>
          <PopOverContents {...{ message, upsell, removeText, clear }} />
        </Fragment>
      ),
    });
  };
}
