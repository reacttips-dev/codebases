import React from 'react';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Selectize from 'bundles/phoenix/components/Selectize';
import codeLanguages from 'bundles/cml/constants/codeLanguages';
import 'css!./__styles__/CMLCodeEditorLanguagePicker';

type Props = {
  onSelect: (selectedLanguage: string) => void;
  onCancel: () => void;
};

class CMLCodeEditorLanguagePicker extends React.Component<Props> {
  selectize: $TSFixMe;

  componentDidMount() {
    this.selectize.selectizeInstance.open();
  }

  render() {
    const options = {
      maxItems: 1,
      create: false,
      persist: false,
      sortField: 'name',
      labelField: 'name',
      searchField: 'name',
      valueField: 'value',
      options: codeLanguages,
      onChange: this.props.onSelect,
      onDropdownClose: this.props.onCancel,
    };

    return (
      <div className="rc-CMLCodeEditorLanguagePicker">
        <Selectize
          placeholder=""
          options={options}
          ref={(selectize: $TSFixMe) => {
            this.selectize = selectize;
          }}
        />
      </div>
    );
  }
}

export default CMLCodeEditorLanguagePicker;
