import React, { useEffect, useState } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { Feature } from 'app/scripts/debug/constants';
import { Category } from './types';
import { usesLanguages, languageParts, currentLocale } from '@trello/locale';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { sendErrorEvent } from '@trello/error-reporting';

import { TemplatePicker } from './TemplatePicker';

const DISMISS_MESSAGE_ID = `boards-page-template-picker`;
const DATE_FOR_NEW_ACCOUNT = new Date(2020, 5, 1); // June 1st, 2020

interface BoardsPageTemplatePickerProps {
  category: Category;
  isNewAccount: (date: Date) => boolean;
  isDismissed: (oneTimeMessageId: string) => boolean;
  setDismissed: (oneTimeMessageId: string) => boolean;
}

type TemplatesListHash = Record<Category, string[]>;

const shouldShowForMemberData = (
  supportedLanguages: string[],
  isNewAccount: boolean,
  isDismissed: boolean,
) => {
  if (isDismissed) {
    return false;
  }

  return isNewAccount && usesLanguages(supportedLanguages);
};

export const BoardsPageTemplatePickerUnconnected: React.FunctionComponent<BoardsPageTemplatePickerProps> = ({
  category = Category.Popular,
  isNewAccount,
  isDismissed,
  setDismissed,
}) => {
  const boardPickerTemplates: {
    [key: string]: TemplatesListHash;
  } = useFeatureFlag('teamplates.web.board-picker-template-list', {});

  const shouldRender = shouldShowForMemberData(
    Object.keys(boardPickerTemplates),
    isNewAccount(DATE_FOR_NEW_ACCOUNT),
    isDismissed(DISMISS_MESSAGE_ID),
  );

  const language = languageParts(currentLocale).language;

  let localizedBoardPickerTemplates: TemplatesListHash;

  if (boardPickerTemplates[currentLocale]) {
    localizedBoardPickerTemplates = boardPickerTemplates[currentLocale];
  } else if (boardPickerTemplates[language]) {
    localizedBoardPickerTemplates = boardPickerTemplates[language];
  } else {
    localizedBoardPickerTemplates = boardPickerTemplates['en'];
  }

  const [selectedCategory, setCategory] = useState<Category>(category);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    Analytics.sendViewedComponentEvent({
      componentType: 'section',
      componentName: 'templatePickerSection',
      source: 'memberBoardsHomeScreen',
    });
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  const templateIds = localizedBoardPickerTemplates[selectedCategory];

  const onDismiss = () => {
    Analytics.sendDismissedComponentEvent({
      componentType: 'section',
      componentName: 'templatePickerSection',
      source: 'memberBoardsHomeScreen',
    });

    try {
      return setDismissed(DISMISS_MESSAGE_ID);
    } catch (err) {
      sendErrorEvent(err, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.BoardsPageTemplatePicker,
        },
      });
    }
  };

  const onClickTemplate = (boardId: string) => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'sectionItem',
      actionSubjectId: 'templateTileSectionItem',
      source: 'templatePickerSection',
      containers: {
        board: { id: boardId },
      },
    });
  };

  const onChangeCategory = ({
    value: newSelectedCategory,
  }: {
    value: Category;
  }) => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'dropdownItem',
      actionSubjectId: 'templatePickerCategoryDropdownItem',
      source: 'templatePickerSection',
      attributes: {
        category: newSelectedCategory,
      },
    });

    setCategory(newSelectedCategory);
  };

  if (!templateIds?.length) {
    return null;
  }

  return (
    <TemplatePicker
      templateIds={templateIds}
      // eslint-disable-next-line react/jsx-no-bind
      onDismiss={onDismiss}
      // eslint-disable-next-line react/jsx-no-bind
      onTemplateClicked={onClickTemplate}
      selectedCategory={selectedCategory}
      // eslint-disable-next-line react/jsx-no-bind
      onChangeCategory={onChangeCategory}
    />
  );
};

export const BoardsPageTemplatePicker: React.FunctionComponent<BoardsPageTemplatePickerProps> = (
  props,
) => (
  <ComponentWrapper>
    <BoardsPageTemplatePickerUnconnected {...props} />
  </ComponentWrapper>
);
