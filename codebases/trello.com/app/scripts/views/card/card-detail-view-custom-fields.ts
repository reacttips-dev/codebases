import React from 'react';
import { LazyCustomFieldsButton } from 'app/src/components/CustomFields';
import { CustomFieldBadgesList } from 'app/src/components/CustomFields/CustomFieldBadgesList';

import { renderComponent } from 'app/src/components/ComponentWrapper';

export const renderCustomFieldsButton = function () {
  this.$('.js-custom-fields').addClass('hide');
  const customFieldsReactRoot = this.$('.js-custom-fields')[0];
  if (customFieldsReactRoot) {
    renderComponent(
      React.createElement(LazyCustomFieldsButton, {
        idCard: this.model.id,
        idBoard: this.model.getBoard()?.id,
        idOrganization: this.model.getBoard()?.get('idOrganization'),
        idEnterprise: this.model.getBoard()?.get('idEnterprise'),
      }),
      customFieldsReactRoot,
    );
    this.$('.js-custom-fields').addClass('button-link');
    this.$('.js-custom-fields').removeClass('hide');
  }
  return this;
};

export const renderCustomFieldsBadges = function () {
  const customFieldsBadgesReactRoot = this.$(
    '.custom-fields-badges-react-container',
  )[0];
  if (customFieldsBadgesReactRoot) {
    renderComponent(
      React.createElement(CustomFieldBadgesList),
      customFieldsBadgesReactRoot,
    );
  }
  return this;
};

export const renderCustomFieldsDisabled = function () {
  this.$('.js-cf-disabled').addClass('hide');
  const customFieldsRoot = this.$('.js-cf-disabled');
  if (customFieldsRoot) {
    this.$('.js-cf-disabled').addClass('disabled');
    this.$('.js-cf-disabled').removeClass('hide');
  }
  return this;
};
