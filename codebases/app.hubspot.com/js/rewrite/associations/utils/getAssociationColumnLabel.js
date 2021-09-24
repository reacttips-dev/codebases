'use es6';

import { getPluralForm } from '../../../crmObjects/methods/getPluralForm';
import unescapedText from 'I18n/utils/unescapedText';
import { isPrimaryAssociation, isGeneralAssociation } from './associationIdentifiers';
import { getSingularForm } from '../../../crmObjects/methods/getSingularForm';
export var getAssociationColumnLabel = function getAssociationColumnLabel(associationDefinition) {
  var isFlexibleAssociationsUngated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var toObjectTypeDefinition = associationDefinition.toObjectTypeDefinition;
  var pluralObjectName = getPluralForm(toObjectTypeDefinition);
  var singularObjectName = getSingularForm(toObjectTypeDefinition);

  if (isPrimaryAssociation(associationDefinition)) {
    return isFlexibleAssociationsUngated ? unescapedText('index.associations.labels.primaryAssociatedObject', {
      singularObjectName: singularObjectName
    }) : unescapedText('index.associations.labels.singularAssociation', {
      singularObjectName: singularObjectName
    });
  }

  if (isGeneralAssociation(associationDefinition) || !associationDefinition.label) {
    return unescapedText('index.associations.labels.unlabeled', {
      pluralObjectName: pluralObjectName
    });
  } // TODO: We'll probably want to add something here to translate hubspot
  // defined associations that don't fall into either of the above cases.
  //
  // For user defined associations we can just show the label they provided when
  // they created the association


  return associationDefinition.label;
};