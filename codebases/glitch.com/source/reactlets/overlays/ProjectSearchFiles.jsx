/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useCallback, useRef } from 'react';
import cn from 'classnames';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import usePreventTabOut from '../../hooks/usePreventTabOut';
import useObservable from '../../hooks/useObservable';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';

function ProjectSearchResult({ results }) {
  const application = useApplication();
  const firstResult = results[0];
  const { isRecent, path } = firstResult;

  const fileExtensionType = (result) => {
    return application.fileByPath(result.path).extensionType();
  };

  const selectSearchResult = (result) => {
    application.fileSearch.selectResult(result);
  };

  return (
    <div className="results-list">
      <ul className="results">
        <span className={fileExtensionType(firstResult)}>
          {/* Existing accessibility issue ported to React.  */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <li
            className="result"
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex="0"
            onClick={() => selectSearchResult(firstResult)}
            onKeyDown={whenKeyIsEnter(() => selectSearchResult(firstResult))}
          >
            <div className="status-badge icon">
              <div className="status warning">
                {results.length}
                <div className="search-in-badge icon" />
              </div>
            </div>
            {isRecent && <div className="result-tip">recent</div>}
            <div className="results-name" title={path}>
              {path}
            </div>
          </li>
        </span>
        {results.map((result, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} className={fileExtensionType(result)}>
            {/* Existing accessibility issue ported to React.  */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li
              className="result nested-result"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex="0"
              title={result.rawMatch}
              onClick={() => selectSearchResult(result)}
              onKeyDown={whenKeyIsEnter(() => selectSearchResult(result))}
            >
              <div className="nested-result-wrap">
                <div className="result-column-wrap">
                  <div className="result-description">{result.line}</div>
                </div>
                <div className="result-code">
                  {result.beforeMatch}
                  <span className="result-match">{result.match}</span>
                  {result.afterMatch}
                </div>
              </div>
            </li>
          </span>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectSearchFiles() {
  const application = useApplication();
  const visible = useObservable(application.projectSearchFilesOverlayVisible);
  const searchValue = useObservable(application.fileSearch.searchValue);
  const searchWhere = useObservable(application.fileSearch.searchWhere);
  const caseSensitive = useObservable(application.fileSearch.caseSensitive);
  const searching = useObservable(application.fileSearch.loading);
  const searchResults = useObservable(application.fileSearch.searchedResults);
  const filteredGroupedSearchResults = useObservable(application.fileSearch.filteredGroupedSearchResults);
  const searchedValue = useObservable(application.fileSearch.searchedValue);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);

  const isSignedIn = useObservable(
    useCallback(() => {
      const currentUser = application.currentUser();
      if (currentUser) {
        return currentUser.loggedIn();
      }
      return false;
    }, [application]),
  );

  const options = useObservable(
    useCallback(() => {
      const currentFilePath = application.currentFileInfo().path;
      const currentFileFolder = application.currentFileInfo().folders || '/';
      const currentFileExtension = application.currentFileInfo().extension || '*';
      return ['All Files', `Current File – ${currentFilePath}`, `Current Folder – ${currentFileFolder}`, `Current Type – *.${currentFileExtension}`];
    }, [application]),
  );

  usePreventTabOut(useRef(), useRef());

  const search = (e) => {
    e.preventDefault();
    application.fileSearch.search();
  };

  const toggleCaseSensitive = () => {
    application.fileSearch.caseSensitive.toggle();
  };

  const searchInputCallbackRef = useCallback((node) => {
    if (node && document.activeElement !== node) {
      node.focus();
      node.select();
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay project-search-files">
        <section className={cn('actions', { disabled: !isMember })}>
          <form onSubmit={search}>
            <div className="input-wrap">
              <input
                id="project-files-search"
                className="input search-input"
                aria-label="Search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => {
                  application.fileSearch.searchValue(e.target.value);
                }}
                ref={searchInputCallbackRef}
                disabled={!isMember}
              />
            </div>
            <div className="input-wrap">
              <select
                className="select search-input"
                value={searchWhere}
                onChange={(e) => {
                  application.fileSearch.searchWhere(e.target.value);
                }}
                disabled={!isMember}
              >
                {options.map((option, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="button-wrap search-option">
                <label
                  htmlFor="case-sensitive-checkbox"
                  className="button button-small button-secondary"
                  tabIndex={isMember ? '0' : '-1'}
                  role="button"
                  aria-pressed={caseSensitive}
                  onKeyPress={whenKeyIsEnter(toggleCaseSensitive)}
                >
                  <input
                    id="case-sensitive-checkbox"
                    className="input"
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={toggleCaseSensitive}
                    tabIndex="-1"
                    disabled={!isMember}
                  />
                  Aa
                </label>
              </div>
            </div>
            <div className="button-wrap">
              <button className="button" onClick={search} disabled={!isMember}>
                Search {searching && <Loader />}
                {searchedValue && !searching && (
                  <div className="status-badge icon">
                    <div className="status warning">
                      {searchResults.length} <div className="icon search-in-badge" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </section>

        {searchResults.length > 0 && (
          <section className="info results-container">
            {filteredGroupedSearchResults.map((results, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ProjectSearchResult key={i} results={results} />
            ))}
          </section>
        )}

        {searchResults.length === 0 && searchedValue && !searching && (
          <section className="info">
            <h2>
              No results for <span>{searchedValue}</span>
            </h2>
            <div className="no-search-results-illustration" />
          </section>
        )}

        <section className="info">
          <p>
            <Icon icon="musicalKeyboard" /> <span>{application.isAppleDevice ? '⌘-Shift-F' : 'Ctrl-Shift-F'}</span>
          </p>
        </section>

        {!isMember && (
          <section className="info">
            <p>For security reasons, only project members can search files</p>
            {!isSignedIn && (
              <a href="//glitch.com/signin" className="sign-in-button button" onClick={application.setDestinationAfterAuth}>
                Sign In
              </a>
            )}
          </section>
        )}
      </dialog>
    </div>
  );
}
