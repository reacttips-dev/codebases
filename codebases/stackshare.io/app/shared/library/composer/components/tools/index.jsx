import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import ToolList from './tool-list';
import {
  STRUCTURE_MIGRATION,
  TOOL_LIST_FROM,
  TOOL_LIST_TO,
  TOOL_LIST_TO_FROM,
  TOOL_LIST_DEFAULT,
  STRUCTURES,
  STRUCTURE_GIVE_ADVICE,
  STRUCTURE_TOOL
} from '../../constants';
import MigrationArrowIcon from '../../../icons/migration-arrow.svg';
import {FOCUS_BLUE} from '../../../../style/colors';

const Container = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: 16
});

const ListSeparator = glamorous.div({
  display: 'flex',
  marginLeft: 5,
  marginRight: 15
});

const ToolsMessage = glamorous.div({
  fontSize: 9,
  fontWeight: 900,
  color: FOCUS_BLUE
});

const Tools = ({
  tools = [],
  fromTools = [],
  toTools = [],
  structure = '',
  toolError = '',
  isPrivate
}) => {
  const filterSelectedTools = result =>
    !fromTools.find(r => r.id === result.id) && !toTools.find(r => r.id === result.id);
  const option = STRUCTURES.find(o => o.key === structure);
  if (structure === STRUCTURE_MIGRATION) {
    return (
      <Container>
        <ToolList
          tools={fromTools}
          listType={TOOL_LIST_FROM}
          hasError={toolError === TOOL_LIST_FROM || toolError === TOOL_LIST_TO_FROM}
          filterResults={filterSelectedTools}
          maxTools={2}
          placeholder={option.placeholder}
        />
        <ListSeparator>
          <MigrationArrowIcon />
        </ListSeparator>
        <ToolList
          tools={toTools}
          listType={TOOL_LIST_TO}
          hasError={toolError === TOOL_LIST_TO || toolError === TOOL_LIST_TO_FROM}
          filterResults={filterSelectedTools}
          maxTools={2}
          placeholder={option.placeholder}
        />
      </Container>
    );
  } else if (structure === STRUCTURE_GIVE_ADVICE) {
    return (
      <Container>
        <ToolList
          tools={tools}
          listType={TOOL_LIST_DEFAULT}
          maxTools={10}
          placeholder={option.placeholder}
        >
          <ListSeparator />
        </ToolList>
      </Container>
    );
  } else if (structure === STRUCTURE_TOOL) {
    return (
      <Container>
        {isPrivate && (
          <ListSeparator>
            <ToolsMessage>TO ADD</ToolsMessage>
          </ListSeparator>
        )}
        <ToolList
          tools={toTools}
          listType={TOOL_LIST_TO}
          maxTools={10}
          hasError={toolError === TOOL_LIST_TO || toolError === TOOL_LIST_TO_FROM}
          filterResults={filterSelectedTools}
          placeholder={option.placeholder}
          isPrivate={isPrivate}
        />
        <ListSeparator>
          <ToolsMessage>{isPrivate ? 'TO REMOVE' : 'OVER'}</ToolsMessage>
        </ListSeparator>
        <ToolList
          tools={fromTools}
          listType={TOOL_LIST_FROM}
          maxTools={10}
          hasError={toolError === TOOL_LIST_FROM || toolError === TOOL_LIST_TO_FROM}
          filterResults={filterSelectedTools}
          placeholder={option.placeholder}
          isPrivate={isPrivate}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <ToolList
          tools={tools}
          maxTools={option.maxTools}
          listType={TOOL_LIST_DEFAULT}
          hasError={toolError === TOOL_LIST_DEFAULT}
          placeholder={option.placeholder}
        />
      </Container>
    );
  }
};

Tools.propTypes = {
  tools: PropTypes.array,
  fromTools: PropTypes.array,
  toTools: PropTypes.array,
  structure: PropTypes.string,
  toolError: PropTypes.string,
  isPrivate: PropTypes.bool
};

export default Tools;
