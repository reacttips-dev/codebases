import { useLayoutEffect, useState } from 'react';

// Generate the title with " | Trello" appended. If the title passed in is an empty string, set title to 'Trello'.
const generateTitle = (title: string) => {
  if (title === undefined || title === null) {
    return 'Trello';
  }
  // Check that title does not already end with 'Trello'. This covers the case where the title was 'Trello' so it does not end up as 'Trello | Trello'.
  if (title.endsWith('Trello')) {
    return title;
  }
  return title.length ? `${title} | Trello` : 'Trello';
};

export const setDocumentTitle = (title: string) => {
  // eslint-disable-next-line @trello/enforce-document-title
  document.title = generateTitle(title);
};

export const useDocumentTitle = (title: string) => {
  const [previousTitle] = useState(document.title);

  // We are technically manipulating the DOM (title property) and therefore need this to be run synchronously so the cleanup function doesn't overwrite the title another component might set.
  useLayoutEffect(() => {
    setDocumentTitle(title);

    return () => {
      setDocumentTitle(previousTitle);
    };
  }, [title, previousTitle]);
};
