import React, { useEffect, useRef, useState } from 'react';
import useDebouncedCallback from 'use-debounce/lib/callback';
import { Loader } from '@glitchdotcom/shared-components';

import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import PackageResult from './PackageResult';

export function PostResultsLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <li className="result see-all">
        <img className="npm icon" src="images/logos/npm.svg" alt="" />
        <div className="result-name">{children}</div>
      </li>
    </a>
  );
}

export function OutdatedResults() {
  const application = useApplication();
  const outdatedResults = useObservable(application.packagesOutdated);

  return (
    <>
      {outdatedResults.map((result) => (
        <PackageResult key={result.name} result={result} />
      ))}
      <PostResultsLink href="https://docs.npmjs.com/getting-started/what-is-npm">What is npm →</PostResultsLink>
    </>
  );
}

export function NoResults() {
  return (
    <>
      <p className="no-results">no results ヾ(_ _*)</p>
      <PostResultsLink href="https://docs.npmjs.com/getting-started/what-is-npm">What is npm →</PostResultsLink>
    </>
  );
}

export function SearchResults({ results, query }) {
  return (
    <>
      {results.map((result) => (
        <PackageResult key={result.name} result={result} />
      ))}
      <PostResultsLink href={`https://www.npmjs.com/search?q=${query}`}>See all results on npm →</PostResultsLink>
    </>
  );
}

export default function AddPackagePop() {
  const application = useApplication();

  const addPackagePopVisible = useObservable(application.addPackagePopVisible);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchInput = useRef(null);

  // Performing the search is debounced to avoid making too many fetches while
  // the user is typing. We can't use _.debounce because the callback is
  // recreated for each render; use-debounce handles cross-render debouncing.
  const [fetchSearchResults] = useDebouncedCallback(async (latestQuery) => {
    setSearching(true);

    if (!latestQuery) {
      setSearchResults(null);
    } else {
      const results = await application.packageUtils.searchForPackages(latestQuery);
      setSearchResults(results);
    }
    setSearching(false);
  }, 250);

  function handleSearchChange(event) {
    setQuery(event.target.value);
    fetchSearchResults(event.target.value);
  }

  // Focus the search input whenever we show the popup
  useEffect(() => {
    if (addPackagePopVisible) {
      searchInput.current.focus();
    }
  }, [addPackagePopVisible]);

  // Render nothing if the popup should be hidden
  if (!addPackagePopVisible) {
    return null;
  }

  return (
    <dialog className="pop-over add-package-pop wide-pop">
      <section className="info">
        <div className="input-wrap">
          <input
            id="package-search"
            className="input search-input"
            placeholder="search npm for packages"
            value={query}
            onChange={handleSearchChange}
            ref={searchInput}
          />
        </div>
      </section>

      <section className="actions results-list">
        <ul className="results">
          {searching && <Loader />}

          {searchResults && searchResults.length > 0 && <SearchResults results={searchResults} query={query} />}
          {searchResults && searchResults.length < 1 && <NoResults />}
          {searchResults === null && <OutdatedResults />}
        </ul>
      </section>
    </dialog>
  );
}
