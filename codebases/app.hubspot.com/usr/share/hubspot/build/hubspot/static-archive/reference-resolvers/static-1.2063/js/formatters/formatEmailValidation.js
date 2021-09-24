'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatValidateEmail = function formatValidateEmail(emailDraft, error) {
  return new ReferenceRecord({
    id: emailDraft,
    referencedObject: error
  });
};

export default formatValidateEmail;