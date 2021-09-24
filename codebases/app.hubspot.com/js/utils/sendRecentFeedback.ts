import { get, remove } from 'unified-navigation-ui/js/utils/tempStorage';
import * as SearchAPI from '../deferred/search/SearchAPI';
export default function sendRecentFeedback() {
  var recentSearch = get('recent_search');

  if (recentSearch) {
    var parsedRecentSearch = JSON.parse(recentSearch);
    parsedRecentSearch.forEach(function (search) {
      SearchAPI.saveRecentSearch(search);
    });
    remove('recent_search');
  }
}