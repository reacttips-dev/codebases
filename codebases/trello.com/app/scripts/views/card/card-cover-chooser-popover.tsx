import React from 'react';
import { forNamespace, forTemplate } from '@trello/i18n';
import { AddCover, SelectCover } from 'app/src/components/CardCoverChooser';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

const { PopOver } = require('app/scripts/views/lib/pop-over');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginPopOverIFrameView = require('app/scripts/views/plugin/plugin-pop-over-iframe-view');

const format = forNamespace('view title');
const formatCardCoverChooser = forTemplate('card_cover_chooser');

const INVALID_HEIGHT = 'Invalid height, must be a positive number';
const INVALID_URL = 'Invalid url, must be http or https';

export const toggleCardCoverChooserPopover = ({
  elem,
  cardId,
  boardId,
}: {
  elem: Element;
  cardId: string;
  boardId: string;
}) => {
  const addCover = (
    <ComponentWrapper key="add-cover">
      <AddCover
        cardId={cardId}
        // eslint-disable-next-line react/jsx-no-bind
        navigateToSelectCover={() => PopOver.popView()}
      />
    </ComponentWrapper>
  );

  const navigateToAddCover = () => {
    PopOver.pushView({
      getViewTitle: () => formatCardCoverChooser('photo-search'),
      reactElement: addCover,
      displayType: 'mod-card-cover-chooser',
    });
  };

  const navigateToPluginCoverMenu = ({
    title,
    url,
    height,
    board,
  }: {
    title: string;
    url: string;
    height: number;
    board: unknown;
  }) => {
    if (!pluginValidators.isValidUrlForIframe(url)) {
      throw t.NotHandled(INVALID_URL);
    }
    if (height && !pluginValidators.isValidHeight(height)) {
      throw t.NotHandled(INVALID_HEIGHT);
    }

    PopOver.pushView({
      view: new PluginPopOverIFrameView({
        title,
        content: {
          url,
          height,
        },
        model: board,
      }),
    });
  };

  const selectCover = (
    <ComponentWrapper key="select-cover">
      <SelectCover
        {...{
          cardId,
          boardId,
          navigateToAddCover,
          navigateToPluginCoverMenu,
        }}
      />
    </ComponentWrapper>
  );

  PopOver.toggle({
    elem,
    getViewTitle: () => format('cover'),
    reactElement: selectCover,
  });
};
