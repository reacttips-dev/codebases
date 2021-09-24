import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import ToolTagger from './tool-tagger';
import {ToolListType} from '../../types';

const ToolList = ({
  tools = [],
  listType,
  hasError,
  maxTools,
  placeholder,
  filterResults = result => !tools.find(r => r.id === result.id),
  children: separator,
  isPrivate
}) => {
  return (
    <Fragment>
      {tools.map((tool, idx) => {
        return (
          <Fragment key={tool.id}>
            <ToolTagger
              tool={tool}
              filterResults={filterResults}
              listType={listType}
              placeholder={placeholder(listType, tools.length)}
              isPrivate={isPrivate}
            />
            {separator && idx < tools.length - 1 && separator}
          </Fragment>
        );
      })}
      {(!maxTools || tools.length < maxTools) && (
        <ToolTagger
          filterResults={filterResults}
          hasError={hasError}
          placeholder={placeholder(listType, tools.length)}
          listType={listType}
          isPrivate={isPrivate}
        />
      )}
    </Fragment>
  );
};

ToolList.propTypes = {
  tools: PropTypes.array,
  listType: ToolListType.isRequired,
  maxTools: PropTypes.number,
  filterResults: PropTypes.func,
  hasError: PropTypes.bool,
  placeholder: PropTypes.func.isRequired,
  children: PropTypes.element,
  isPrivate: PropTypes.bool
};

export default ToolList;
