import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ALABASTER, FOCUS_BLUE} from '../../../style/colors';
import {grid} from '../../../utils/grid';

const Container = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: grid(3)
});

const Text = glamorous.div({
  fontSize: 10,
  marginRight: grid(1),
  width: 19,
  flexShrink: 0,
  textAlign: 'center'
});

const Empty = glamorous.div({
  borderRadius: grid(1),
  background: ALABASTER,
  flex: 1,
  display: 'flex',
  height: grid(1)
});

const Full = glamorous.div(
  {
    borderRadius: grid(1),
    background: FOCUS_BLUE,
    transition: 'width 1s'
  },
  ({progress}) => ({
    width: `${progress}%`,
    borderTopRightRadius: progress === 100 ? grid(1) : 0,
    borderBottomRightRadius: progress === 100 ? grid(1) : 0
  })
);

export default function ProgressBar(props) {
  const {progress} = props;

  return (
    <Container>
      <Text>{progress}%</Text>
      <Empty>
        <Full progress={progress} />
      </Empty>
    </Container>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number
};

ProgressBar.defaultProps = {
  progress: 0
};
