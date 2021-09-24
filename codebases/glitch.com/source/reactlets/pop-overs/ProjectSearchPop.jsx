import React, { useCallback } from 'react';
import uniqBy from 'lodash/uniqBy';
import ActionSearchResult from '../ActionSearchResult';
import ProjectSearchResult from '../ProjectSearchResult';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import { ASSET_FILE_PATH } from '../../const';
import projectSearchActions from '../../data/project-search-actions';
import fuzzy from '../../utils/fuzzy';

function sortResults(a, b) {
  if (a.type === 'file' && b.type === 'action') {
    return -1;
  }
  if (b.type === 'file' && a.type === 'action') {
    return 1;
  }
  return b.score - a.score;
}

function getRecentFiles(application) {
  const recentFiles = application
    .recentFiles()
    .slice()
    .reverse();

  const nonDeletedFiles = recentFiles.filter((recentFile) => application.fileByPath(recentFile.path()));
  const uniqueNonDeletedFiles = uniqBy(nonDeletedFiles, (recentFile) => recentFile.path());
  return uniqueNonDeletedFiles.slice(0, 5);
}

function RecentFiles() {
  const application = useApplication();

  return useObservable(
    useCallback(
      () =>
        getRecentFiles(application).map((file) => (
          <ProjectSearchResult
            item={{
              path: file.path(),
              extensionType: file.extensionType(),
              name: file.name(),
              recent: true,
            }}
            key={file.uuid()}
          />
        )),
      [application],
    ),
  );
}

function HighlightParts({ children, indices }) {
  let nextStart = 0;

  return (
    <>
      {indices.map((i) => {
        const curStart = nextStart;
        nextStart = i + 1;
        return (
          <React.Fragment key={i}>
            {children.slice(curStart, i)}
            <span className="result-match">{children.slice(i, i + 1)}</span>
          </React.Fragment>
        );
      })}
      {children.slice(nextStart)}
    </>
  );
}

function SearchResults({ query }) {
  const application = useApplication();
  const recentFiles = useObservable(application.recentFiles);

  const elements = useObservable(
    useCallback(() => {
      const files = application
        .files()
        .filter((file) => file.path() !== ASSET_FILE_PATH)
        .map((file) => ({
          path: file.path(),
          extensionType: file.extensionType(),
          name: file.name(),
          recent: recentFiles.some((recent) => recent.path() === file.path()),
        }));

      const lowerCaseQuery = query.toLowerCase();

      const getLowerCasePath = (file) => file.path.toLowerCase();
      const fileResults = fuzzy(files, lowerCaseQuery, getLowerCasePath).map((result) => ({
        ...result,
        type: 'file',
        highlighted: {
          path: <HighlightParts indices={result.matches}>{result.item.path}</HighlightParts>,
          name: (
            <HighlightParts indices={result.matches.map((i) => i - (result.item.path.length - result.item.name.length)).filter((i) => i >= 0)}>
              {result.item.name}
            </HighlightParts>
          ),
        },
      }));

      const getLowerCaseName = (action) => action.name.toLowerCase();
      const actionResults = fuzzy(projectSearchActions, lowerCaseQuery, getLowerCaseName).map((result) => ({
        ...result,
        type: 'action',
        highlighted: {
          name: <HighlightParts indices={result.matches}>{result.item.name}</HighlightParts>,
        },
      }));

      const combinedResults = fileResults
        .concat(actionResults)
        .sort(sortResults)
        .map(({ item, highlighted, type }, i) => {
          /* eslint-disable react/no-array-index-key */
          if (type === 'file') {
            return <ProjectSearchResult item={item} highlighted={highlighted} key={`file-${i}`} />;
          } // else type === "action"
          return <ActionSearchResult item={item} highlighted={highlighted} key={`action-${i}`} />;
          /* eslint-enable react/no-array-index-key */
        });

      return combinedResults;
    }, [query, application, recentFiles]),
  );

  return elements;
}

export default function ProjectSearchPop() {
  const application = useApplication();
  const visible = useObservable(application.projectSearchPopVisible);
  const loaded = useObservable(application.projectIsLoaded);
  const search = useObservable(application.projectSearchBoxValue);

  const showProjectSearchFilesOverlay = () => {
    application.analytics.track('Project Searched', { searchTarget: 'Project Search', searchTerm: search });
    application.fileSearch.searchValue(search);
    application.fileSearch.search();
    application.closeAllPopOvers();
    application.projectSearchFilesOverlayVisible(true);
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog id="project-search-pop" className="pop-over project-search-pop" data-testid="project-search-pop">
      <section className="actions results-list">
        {!loaded && <div className="loader-ellipses" />}
        <ul className="results">{search.length === 0 ? <RecentFiles /> : <SearchResults query={search} />}</ul>
      </section>
      {search.length !== 0 && (
        <section className="info">
          <div className="button-wrap">
            <button className="button" onClick={showProjectSearchFilesOverlay} tabIndex="0">
              search files for '{search}'
            </button>
          </div>
        </section>
      )}
    </dialog>
  );
}
