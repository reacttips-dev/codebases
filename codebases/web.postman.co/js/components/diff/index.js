import React from 'react';
import TableDiff from './TableDiff';
import WordsDiff from './WordsDiff';
import SentencesDiff from './SentencesDiff';
import CodeDiff from './CodeDiff';

/**
 * DiffView by property
 *
 * @param {Object} props
 */
export default function DiffViewByProperty (props) {
  const diff = props.diff;

  if (!diff) {
    return null;
  }

  if (diff.type === 'words') {
    return (
      <WordsDiff
        conflictArray={props.conflictArray}
        diff={diff}
        onValueSelect={props.onValueSelect}
      />
    );
  }

  if (diff.type === 'code') {
    return (
      <CodeDiff
        conflictArray={props.conflictArray}
        diff={diff}
        onValueSelect={props.onValueSelect}
      />
    );
  }

  if (diff.type === 'sentences') {
    return (
      <SentencesDiff
        diff={diff}
        conflictArray={props.conflictArray}
        onValueSelect={props.onValueSelect}
      />
    );
  }

  if (diff.type === 'table') {
    return (
      <TableDiff
        showDescriptionColumn
        showEnabledColumn
        conflictArray={props.conflictArray}
        diff={diff}
        onValueSelect={props.onValueSelect}
      />
    );
  }
}
