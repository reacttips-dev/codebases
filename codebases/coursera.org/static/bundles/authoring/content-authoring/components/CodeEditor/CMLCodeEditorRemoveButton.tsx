import React from 'react';

import { CloseIcon } from '@coursera/cds-icons';
import _t from 'i18n!nls/authoring';
import 'css!./__styles__/CMLCodeEditorRemoveButton';

type Props = {
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

class CMLCodeEditorRemoveButton extends React.Component<Props> {
  render() {
    const { onClick } = this.props;

    return (
      <div className="rc-CMLCodeEditorRemoveButton">
        <button type="button" title={_t('Delete code block')} className="remove-code-block-btn" onClick={onClick}>
          <CloseIcon size="small" color="interactive" />
        </button>
      </div>
    );
  }
}

export default CMLCodeEditorRemoveButton;
