export const START_SEARCHING_RSS_SEARCH_RESULTS =
  '@@search/START_SEARCHING_RSS_SEARCH_RESULTS';
export const RECEIVE_RSS_SEARCH_RESULTS = '@@search/RECEIVE_RSS_SEARCH_RESULTS';

const initialState = {
  isSearchingRssTypeaheadResults: false,
  rssTypeaheadResults: [],
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_SEARCHING_RSS_SEARCH_RESULTS:
      return {
        ...state,
        isSearchingRssTypeaheadResults: true,
        rssTypeaheadResults: [],
      };
    case RECEIVE_RSS_SEARCH_RESULTS: {
      // localStorage
      const { results } = action.payload;
      return {
        ...state,
        isSearchingRssTypeaheadResults: false,
        rssTypeaheadResults: results,
      };
    }
    default:
      return state;
  }
}

export function startSearchingRSSSearchResults() {
  return {
    type: START_SEARCHING_RSS_SEARCH_RESULTS,
  };
}

// action creators
export function receiveRSSSearchResults(results) {
  return {
    type: RECEIVE_RSS_SEARCH_RESULTS,
    payload: {
      results,
    },
  };
}

export function searchRSSFeeds(query) {
  return (dispatch, getState) => {
    dispatch(startSearchingRSSSearchResults());
    // const { submitRSSSearch } = this.props.actions;
    // submitRSSSearch(query);
    const headers = new Headers();
    const params = {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'default',
    };
    const escapedQuery = encodeURIComponent(query);
    fetch(`https://itunes.apple.com/search?media=podcast&term=${escapedQuery}`)
      .then(response => response.json())
      .then(json => {
        const results = json && json.results ? json.results : [];
        const filteredResults = results.map(item => ({
          podcastName: item.collectionName,
          podcastDescription: '', // iTunes doesn't return a desc
          authorName: item.artistName,
          episodeCount: item.trackCount,
          image: item.artworkUrl100,
          feedUrl: item.feedUrl,
          type: 'iTunes',
        }));
        dispatch(receiveRSSSearchResults(filteredResults));
      });
  };
}
