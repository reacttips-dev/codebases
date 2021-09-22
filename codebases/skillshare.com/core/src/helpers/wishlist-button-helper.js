import Utils from 'core/src/base/utils';

const WishlistButtonHelper = {
  fetchListItems: function(sku) {
    const url = '/lists/user';

    return Utils.ajax(url, {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: {
        parent_sku: sku,
        custom_list_id: null,
      },
    });
  },

  onClickListItem: function(sku, customListId, isSaving) {
    const endpoint = isSaving ? 'add-class' : 'remove-class';

    Utils.ajax(`/lists/${customListId}/${endpoint}`, {
      data: JSON.stringify({
        parent_sku: sku,
        customListId,
        via: 'save-list-popover',
      }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: () => { },
    });
  },

  onCreateNewList: function(sku, title) {
    return Utils.ajax('/lists/new', {
      data: JSON.stringify({
        title,
        via: 'save-list-popover',
      }),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: (response) => {
        this.onClickListItem(sku, response.id, true);
      },
    });
  },
};

export default WishlistButtonHelper;

