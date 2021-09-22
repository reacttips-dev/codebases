import Utils from 'core/src/base/utils';
import Playlist from 'core/src/models/playlist';
import PopoverView from 'core/src/views/modules/popover';
import saveListPopoverTemplate from 'text!core/src/templates/popovers/save-list-popover.mustache';

const SaveListPopover = PopoverView.extend({

  className: 'save-list-popover',

  template: saveListPopoverTemplate,

  templateData: {},

  initialize: function (options, ...args) {
    this.options = options || {};

    this.model = new Playlist();
    this.parentSku = this.options.parentSku;
    this.templateData.hasLoaded = false;
    this.customListId = this.options.customListId ? this.options.customListId : null;

    PopoverView.prototype.initialize.apply(this, [options, ...args]);
  },

  afterRender: function(...args) {
    _.bindAll(this, 'onSubmitList', 'onCreateListFocus', 'onClickCancel', 'onClickCreate', 'onSelectExistingList', 'onKeydownListInput');

    $('.submit-list-name').on('click', this.onSubmitList);
    $('.list-input').on('focus', this.onCreateListFocus);
    $('.first-list-cancel').on('click', this.onClickCancel);
    $('.existing-list-action').on('click', this.onClickCreate);
    $('.existing-item').on('click', this.onSelectExistingList);
    $('.list-input').on('keypress', this.onKeydownListInput);

    PopoverView.prototype.afterRender.apply(this, args);
  },

  onSelectExistingList: function (e) {
    e.preventDefault();
    const $listEl = $(e.target);
    const classIsInList = $listEl.hasClass('selected');

    // Eagerly close the popover instead of waiting for success of add or removal actions
    this.close();

    if (classIsInList) {
      this.removeClassFromList($listEl.data('list-id'));
    } else {
      this.addClassToList($listEl.data('list-id'));
    }
  },

  fetchLists: function() {
    const url = '/lists/user';
    Utils.ajaxRequest(url, {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: {
        parent_sku: this.parentSku,
        custom_list_id: this.customListId,
      },
      success: (response) => {
        let reqResponse = response;
        // sort the lits alphabetically, by title
        if ((reqResponse instanceof Array) && (reqResponse.length > 1)) {
          reqResponse = reqResponse.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        }
        this.templateData.listData = reqResponse;
        this.templateData.firstList = reqResponse.length === 0;
        this.templateData.hasLoaded = true;
        this.render();
        this.updateVisiblePopover();
        this.focusListInput();
        this.reposition();
      },
    });
  },

  onSubmitList: function (e) {
    e.preventDefault();
    const input = $('.list-input');
    const listName = input.val();

    if (listName === '') {
      this.onCreateListError('List name is required.');
    } else {
      this.model.set({title: listName, via: 'save-list-popover'});
      this.model.save()
        .then((response) => {
          this.close();
          this.addClassToList(response.id);
        })
        .fail((response) => {
          const { attributes } = response.responseJSON;
          const errorMessage = attributes && attributes.title ? attributes.title[0] : 'There was an error saving your list';
          this.onCreateListError(errorMessage);
        });
    }
  },

  onClickCancel: function (e) {
    e.preventDefault();
    this.close();
  },

  onCreateListError: function (text) {
    $('.list-input').addClass('list-input-error');
    $('.create-list-error').show();
    $('.create-list-error-message').html(text);
  },

  onCreateListFocus: function() {
    $('.list-input').removeClass('list-input-error');
    $('.create-list-error').hide();
    $('.create-list-error-message').html('');
  },

  focusListInput: function() {
    $('.list-input').focus();
  },

  onKeydownListInput: function(e) {
    if(e.which === 13) {
      this.onSubmitList(e);
    }
  },

  addClassToList: function (customListId) {
    const successFn = (response) => {
      this.unmarkListAsComplete(customListId, 'Unable to save class');
      SS.events.trigger('alerts:create', {
        title: 'Saved to',
        action: response.url,
        actionString: response.title,
        type: 'success-sticky',
      });
    };
    this.sendListClassRequest('add-class', customListId, successFn, 'Unable to save class');
  },

  removeClassFromList: function (customListId) {
    const successFn = () => {
      SS.events.trigger('alerts:create', {
        title: 'Removed class from list',
        type: 'success-sticky',
      });
    };
    this.sendListClassRequest('remove-class', customListId, successFn, 'Unable to remove class');
  },

  sendListClassRequest: function (endpoint, customListId, successFn, errorMsg) {
    Utils.ajaxRequest(`/lists/${customListId}/${endpoint}`, {
      data: JSON.stringify({
        parent_sku: this.parentSku,
        customListId: customListId,
        via: 'save-list-popover',
      }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: successFn,
      error: () => {
        SS.events.trigger('alerts:create', {
          title: errorMsg,
          type: 'error',
        });

        this.close();
      },
    });
  },

  unmarkListAsComplete: function(customListId, errorMsg) {
    Utils.ajaxRequest(`/lists/${customListId}/complete`, {
      data: JSON.stringify({
        id: customListId,
        is_complete: 0,
        mark_all_as_complete: false,
      }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: () => {},
      error: () => {
        SS.events.trigger('alerts:create', {
          title: errorMsg,
          type: 'error',
        });

        this.close();
      },
    });
  },

  onClickCreate: function (event) {
    event.preventDefault();
    $('.list-content').hide();
    $('.create-new-list').show();
    $('.list-cancel').on('click', this.onClickBackToList.bind(this));
    this.focusListInput();
  },

  onClickBackToList: function () {
    $('.list-content').show();
    $('.create-new-list').hide();
  },

});

export default SaveListPopover;

