/* eslint-disable import/no-default-export */
import { BackIcon } from '@trello/nachos/icons/back';
import { clearSearchQuery } from 'app/gamma/src/modules/state/models/search';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import preventDefault from 'app/gamma/src/util/prevent-default';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('search_instant_results');

interface BackButtonProps {
  onClick: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onClick() {
      dispatch(clearSearchQuery());
    },
  };
};

class BackButton extends React.Component<BackButtonProps> {
  render() {
    const { onClick } = this.props;

    return (
      <a onClick={preventDefault(onClick)} href="#">
        <BackIcon size="small" color="quiet" />
        {format('back')}
      </a>
    );
  }
}

export default connect(null, mapDispatchToProps)(BackButton);
