/* eslint-disable @trello/filename-case */
import React from 'react';
import { showFlag } from '@trello/nachos/experimental-flags';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('search_instant_results');
export function showSearchErrorAlertFlag() {
  showFlag({
    id: 'MULTIPLE_SEARCH_ERROR_FLAG',
    appearance: 'error',
    title: format('looks-like-youve-gotten-a-few-errors'),
    description: (
      <p>
        {format('check-status-page', {
          statusPageLink: (
            <a href="https://trellostatus.com" target="_blank">
              {format('site-status-page')}
            </a>
          ),
        })}
      </p>
    ),
    isAutoDismiss: true,
    msTimeout: 6000,
  });
}
