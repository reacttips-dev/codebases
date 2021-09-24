import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CHARCOAL, GUNSMOKE} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {formatCount} from '../../../../shared/utils/format';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const Thumbnail = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 59,
  width: 59,
  border: `1px solid ${ASH}`,
  borderRadius: 2
});

const Image = glamorous.img({
  height: 35,
  width: 35,
  borderRadius: 2
});

const Name = glamorous.div({
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  color: CHARCOAL,
  fontSize: 15,
  marginTop: 7
});

const Stacks = glamorous.div({
  display: 'flex',
  marginTop: 7
});

const StacksCount = glamorous.div({
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  color: CHARCOAL,
  fontSize: 12
});

const StacksLabel = glamorous.div({
  ...BASE_TEXT,
  color: GUNSMOKE,
  fontSize: 12,
  marginLeft: 5
});

export default class Alternative extends Component {
  static propTypes = {
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    stacks: PropTypes.number
  };

  render() {
    const {name, imageUrl, stacks} = this.props;
    return (
      <Container>
        <Thumbnail>
          <Image src={imageUrl} alt={`Logo of ${name}`} />
        </Thumbnail>
        <Name>{name}</Name>
        <Stacks>
          <StacksCount>{formatCount(stacks)}</StacksCount>
          <StacksLabel>Stacks</StacksLabel>
        </Stacks>
      </Container>
    );
  }
}
