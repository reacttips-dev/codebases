import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import MentionsWidget from '../mentions-widget';
import SplitInputManager from './split-input-manager';
import {getStructureDetails} from '../../utils';

const Container = glamorous.div({
  position: 'relative'
});

const Input = ({structure, textFieldEl, value, id, onChange, showMarkdownHelp, style, onFocus}) => {
  const option = getStructureDetails(structure);
  const {splitInputsEnabled, inputPlaceholder, splitInputs} = option;
  const splitInputsActive = false;
  return (
    <Fragment>
      {((splitInputsEnabled && !splitInputsActive) ||
        (splitInputsEnabled && id) ||
        !splitInputsEnabled) && (
        <Container>
          <MentionsWidget
            innerRef={textFieldEl}
            value={splitInputsEnabled && !id ? '' : value[0].text}
            onChange={onChange}
            showMarkdownHelp={showMarkdownHelp}
            style={style}
            onFocus={onFocus}
            placeholder={inputPlaceholder}
          />
        </Container>
      )}
      {splitInputsActive && splitInputsEnabled && (
        <SplitInputManager onChange={onChange} inputs={splitInputs} value={value} />
      )}
    </Fragment>
  );
};

Input.propTypes = {
  structure: PropTypes.string,
  textFieldEl: PropTypes.any,
  value: PropTypes.any,
  id: PropTypes.string,
  onChange: PropTypes.func,
  showMarkdownHelp: PropTypes.bool,
  style: PropTypes.object,
  onFocus: PropTypes.func
};

export default Input;
