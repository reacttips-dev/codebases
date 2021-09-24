import React from 'react';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

function withinRange(x, min, max) {
  while (x < min) {
    x += max;
  }
  return x % max;
}

export default function ProjectNavigatorsFooter() {
  const application = useApplication();
  const currentSearchValue = useObservable(application.fileSearch.searchedValue);
  const searchedResults = useObservable(application.fileSearch.searchedResults);
  const totalResults = searchedResults.length;
  const visible = totalResults > 0;

  const previousResult = () => {
    const result = application.fileSearch.selectedResult();
    const results = application.fileSearch.searchedResults();
    const newIndex = withinRange(typeof result.index === 'number' ? result.index - 1 : -1, 0, results.length);
    application.fileSearch.selectResult(results[newIndex]);
  };

  const nextResult = () => {
    const result = application.fileSearch.selectedResult();
    const results = application.fileSearch.searchedResults();
    const newIndex = withinRange(typeof result.index === 'number' ? result.index + 1 : 0, 0, results.length);
    application.fileSearch.selectResult(results[newIndex]);
  };

  const clearSearch = () => {
    application.fileSearch.clearSearch();
  };

  const showProjectSearchFilesOverlay = (e) => {
    e.preventDefault();
    application.projectSearchFilesOverlayVisible(true);
  };

  if (!visible) {
    return null;
  }

  return (
    <section className="project-navigators">
      <div className="button-wrap">
        <div className="segmented-buttons">
          <button className="button" onClick={previousResult}>
            <div className="left-arrow icon" />
          </button>
          <button className="button" onClick={nextResult}>
            <div className="right-arrow icon" />
          </button>
          <button className="button" onClick={clearSearch}>
            <div className="close-icon icon" />
          </button>
          <button className="button search-box" onClick={showProjectSearchFilesOverlay}>
            <span className="search-box-value">{currentSearchValue}</span>
            <span className="status-badge">
              <div className="status warning">
                {totalResults} <div className="search-in-badge icon" />
              </div>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
