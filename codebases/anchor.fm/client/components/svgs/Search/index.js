import React from 'react';

const Search = ({ color = '#7F8287', size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.9 13.22l-3.67-3.68a5.8 5.8 0 1 0-.68.68l3.67 3.69c.13.12.33.12.46 0l.23-.23a.32.32 0 0 0 0-.46zM.98 5.8a4.84 4.84 0 1 1 9.67.01A4.84 4.84 0 0 1 .97 5.8z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
);

export default Search;
