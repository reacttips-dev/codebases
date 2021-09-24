import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ScrollPanel from '../../../../shared/library/panels/scroll/index.jsx';
import {ItemRow} from './item-row';

const PANEL_HEIGHT = 200;

const Container = glamorous.div({
  marginTop: 14
});

const List = glamorous.div({});

export class Leaderboard extends Component {
  static propTypes = {
    items: PropTypes.array,
    type: PropTypes.string
  };

  render() {
    const {items, type} = this.props;
    return (
      <Container>
        <ScrollPanel height={PANEL_HEIGHT}>
          <List>
            {items.map((item, index) => {
              return <ItemRow key={`${type}-${index}`} item={item} type={type} />;
            })}
          </List>
        </ScrollPanel>
      </Container>
    );
  }
}
