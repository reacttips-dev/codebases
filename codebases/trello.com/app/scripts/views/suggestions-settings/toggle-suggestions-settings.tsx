import { forNamespace } from '@trello/i18n';
import { SuggestionsSettings } from 'app/src/components/SuggestionsSettings';
import { MemberState } from 'app/scripts/view-models/member-state';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import React from 'react';

const viewTitle = forNamespace('view title');

function onStopShowingSuggestions() {
  MemberState.setShowSuggestions(false);
  PopOver.popView();
}

export function toggleSuggestionsSettings(context: string) {
  return (e: Event) => {
    e.stopPropagation();
    e.preventDefault();

    const popoverOptions = {
      elem: e.currentTarget,
      getViewTitle: () => viewTitle('suggestions settings'),
      reactElement: (
        <SuggestionsSettings
          key="suggestions-settings"
          context={context}
          onStopShowingSuggestions={onStopShowingSuggestions}
        />
      ),
    };

    if (PopOver.contains(e.currentTarget)) {
      PopOver.pushView(popoverOptions);
    } else {
      PopOver.toggle(popoverOptions);
    }
  };
}
