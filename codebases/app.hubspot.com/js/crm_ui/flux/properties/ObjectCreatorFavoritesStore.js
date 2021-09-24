'use es6';

import defineObjectTypeStore from 'crm_data/flux/defineObjectTypeStore';
import * as FavoritePropertiesAPI from 'crm_data/properties/FavoritePropertiesAPI';
export default defineObjectTypeStore({
  actionTypePrefix: 'OBJECT_CREATOR_FAVORITE_PROPERTIES',
  fetch: FavoritePropertiesAPI.getObjectCreatorFavorites
}).register();