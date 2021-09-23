import { SystemRecognizedFileExtensionList } from '../Constants';
export var parseFileExtensionFromSearch = function parseFileExtensionFromSearch(searchQuery) {
  if (!searchQuery) {
    return {
      systemRecognizedFileExtension: undefined,
      searchQuery: searchQuery
    };
  }

  var searchKeywordList = searchQuery.trim().toLowerCase().split(' ');
  var systemRecognizedFileExtension = SystemRecognizedFileExtensionList.find(function (extension) {
    return searchKeywordList.includes(extension);
  });

  if (searchQuery === systemRecognizedFileExtension) {
    return {
      searchQuery: '',
      systemRecognizedFileExtension: systemRecognizedFileExtension
    };
  }

  if (systemRecognizedFileExtension) {
    var trimmedString = searchKeywordList.filter(function (word) {
      return word !== systemRecognizedFileExtension;
    }).join(' ');
    return {
      searchQuery: trimmedString,
      systemRecognizedFileExtension: systemRecognizedFileExtension
    };
  }

  return {
    searchQuery: searchQuery
  };
};