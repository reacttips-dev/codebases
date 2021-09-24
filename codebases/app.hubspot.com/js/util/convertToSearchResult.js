'use es6';

import { Map as ImmutableMap } from 'immutable';
import UserContainer from 'SequencesUI/data/UserContainer';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UserViewRecord from 'SalesContentIndexUI/data/records/UserViewRecord';

var getUserView = function getUserView(userId) {
  var user = UserContainer.get();
  var currentUserId = user.user_id;
  var firstName = user.first_name;
  var lastName = user.last_name;
  var email = user.email;

  if (userId !== currentUserId) {
    return UserViewRecord();
  }

  return UserViewRecord({
    firstName: firstName,
    lastName: lastName,
    email: email
  });
};

export var getCurrentUserView = function getCurrentUserView() {
  var user = UserContainer.get();
  var firstName = user.first_name;
  var lastName = user.last_name;
  var email = user.email;
  return UserViewRecord({
    firstName: firstName,
    lastName: lastName,
    email: email
  });
};
export var convertFolderToSearchResult = function convertFolderToSearchResult(folder) {
  return SearchResultRecord.initFromJS({
    contentType: SearchContentTypes.SEQUENCES_FOLDER,
    contentId: folder.get('id'),
    name: folder.get('name'),
    userId: folder.get('userId'),
    createdAt: folder.get('createdAt'),
    updatedAt: folder.get('updatedAt'),
    userView: folder.get('userView')
  });
};
export var convertSequenceToSearchResult = function convertSequenceToSearchResult(sequence) {
  return SearchResultRecord.initFromJS({
    contentType: SearchContentTypes.SEQUENCE,
    contentId: sequence.get('id'),
    name: sequence.get('name'),
    userId: sequence.get('userId'),
    createdAt: sequence.get('createdAt'),
    updatedAt: sequence.get('updatedAt'),
    folderId: sequence.get('folderId'),
    metadata: ImmutableMap({
      analyticsData: ImmutableMap({
        executing: 0
      }),
      enrollmentCount: 0
    }),
    userView: sequence.get('userView') || getUserView(sequence.get('userId'))
  });
};