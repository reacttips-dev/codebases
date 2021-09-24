import React, {Component} from 'react';
import * as C from './stack-edit_constants';
import {observer} from 'mobx-react';

export default
@observer
class StackEditLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <img src={C.IMG_SPINNER} className="onboarding__tool-selection__loading" />
      </div>
    );
  }
}
