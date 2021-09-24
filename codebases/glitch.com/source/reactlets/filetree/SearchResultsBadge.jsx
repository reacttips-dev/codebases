import React from 'react';

export default function SearchResultsBadge({ resultCount }) {
  return (
    <div className="search-state">
      <span className="status-badge">
        <div className="status warning">
          {resultCount}
          <div className="search-in-badge icon" />
        </div>
      </span>
    </div>
  );
}
