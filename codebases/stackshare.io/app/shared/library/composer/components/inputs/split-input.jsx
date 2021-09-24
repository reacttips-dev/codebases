import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import MentionsWidget from '../mentions-widget';
import {BASE_TEXT} from '../../../../style/typography';
import {WHITE, SILVER_ALUMINIUM, SHADOW} from '../../../../style/colors';
import {TEXTAREA_HEIGHT, MAX_TEXTAREA_HEIGHT} from '../../constants';

const Container = glamorous.div({
  boxSizing: 'border-box',
  position: 'relative',
  height: 'auto',
  padding: '0 15px 0 15px'
});

const InputWrapper = glamorous.div();

const Label = glamorous.div({
  ...BASE_TEXT,
  color: SILVER_ALUMINIUM,
  backgroundColor: WHITE,
  position: 'absolute',
  textTransform: 'uppercase',
  top: -8,
  fontSize: 9,
  paddingLeft: 7,
  paddingRight: 7
});

const SplitInput = ({input: {label}, onChange, index, value: {text}}) => {
  const inputEl = useRef();
  const [textAreaHeight, setTextareaHeight] = useState(TEXTAREA_HEIGHT);

  useEffect(() => {
    if (index === 0) {
      const el = inputEl.current;
      el.focus();
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, []);

  return (
    <Container>
      <Label>{label}</Label>
      <InputWrapper>
        <MentionsWidget
          innerRef={inputEl}
          value={text}
          onChange={(e, scrollHeight) => {
            setTextareaHeight(Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT));
            onChange(e, null, index);
          }}
          showMarkdownHelp={false}
          style={{
            color: SHADOW,
            minHeight: '80px',
            height: `${textAreaHeight}px`
          }}
          placeholder={''}
          onFocus={() => {
            const el = inputEl.current;
            el.selectionStart = el.selectionEnd = el.value.length;
          }}
        />
      </InputWrapper>
    </Container>
  );
};

SplitInput.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  index: PropTypes.number,
  value: PropTypes.object
};

export default SplitInput;
