import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import SplitInput from './split-input';
import MarkdownHelp from '../markdown/markdown-help';
import {ASH} from '../../../../style/colors';

const Container = glamorous.div(
  {
    paddingTop: 20,
    paddingBottom: 40,
    position: 'relative'
  },
  ({childCount}) => ({
    ' > div:first-of-type': {
      borderBottomWidth: childCount === 1 ? 1 : 0,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2
    },
    ' > div': {
      borderColor: ASH,
      borderStyle: 'dotted',
      borderWidth: 1,
      borderBottomWidth: childCount > 1 ? 0 : 1
    },
    ' > div:last-of-type': {
      borderBottomWidth: 1,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2
    }
  })
);

const SplitInputManager = ({inputs, onChange, value}) => {
  return (
    <Container childCount={inputs.length}>
      {inputs.map((input, index) => (
        <SplitInput
          key={index}
          index={index}
          input={input}
          onChange={onChange}
          value={value[index]}
        />
      ))}
      <span>
        <MarkdownHelp />
      </span>
    </Container>
  );
};

SplitInputManager.propTypes = {
  inputs: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any
};

export default SplitInputManager;
