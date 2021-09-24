'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
var DEFAULT_ICON_URL = 'https://hubspot-avatars.s3.amazonaws.com/default-80.png';

var formatPersonaReference = function formatPersonaReference(persona) {
  return new ReferenceRecord({
    id: "persona_" + persona.id,
    label: persona.name,
    description: persona.label,
    icon: ImmutableMap({
      type: 'image',
      src: persona.imageUrl || DEFAULT_ICON_URL
    }),
    referencedObject: fromJS(persona)
  });
};

var formatPersonas = function formatPersonas(personas) {
  return indexBy(get('id'), List(personas).map(formatPersonaReference));
};

export default formatPersonas;