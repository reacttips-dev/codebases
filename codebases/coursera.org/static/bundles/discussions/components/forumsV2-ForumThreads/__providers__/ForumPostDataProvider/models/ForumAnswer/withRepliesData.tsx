import React from 'react';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { loadingStates } from 'bundles/discussions/constants';
import { ForumPostReply } from 'bundles/discussions/lib/types';

type PropsFromStores = {
  questionId: string;
  page: number;
  sort: string;
};

type PropsFromCaller = {
  questionId: string;
  page: number;
  sort: string;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

type Component = (PropsToComponent) => JSX.Element | null;

export const withRepliesData = (component: Component) => {
  return connectToStores<PropsToComponent, PropsFromCaller>(
    component,
    ['ThreadDetailsStore'],
    ({ ThreadDetailsStore }, { questionId, page, sort }) => {
      return {
        replies: ThreadDetailsStore.getReplies(questionId, page, sort) || [],
        pageCount: ThreadDetailsStore.getPageCount(questionId, page, sort),
        savingStates: ThreadDetailsStore.savingStates,
        loadingState:
          ThreadDetailsStore.getAnswerLoadedState({
            questionId,
            page,
            sort,
          }) || loadingStates.LOADING,
        isQuestionLoaded: ThreadDetailsStore.isLoaded({ questionId, page, sort }),
      };
    }
  );
};
