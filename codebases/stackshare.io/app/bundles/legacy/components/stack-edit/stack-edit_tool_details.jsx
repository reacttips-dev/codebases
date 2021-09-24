import React, {Component} from 'react';
import {observer} from 'mobx-react';

import ToolDetails from '../shared/tool_details.jsx';
import StackEditSaveRow from './stack-edit_save-row.jsx';

export default
@observer
class StackEditToolDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ToolDetails />
        <StackEditSaveRow noContinueButton={true} />
      </div>
    );
  }
}
