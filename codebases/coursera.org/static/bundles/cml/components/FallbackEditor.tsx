import React from 'react';
import plainTextConverter from 'bundles/cml/utils/plainTextConverter';
import CMLUtils from 'bundles/cml/utils/CMLUtils';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import placeCaretAtEnd from 'bundles/phoenix/lib/placeCaretAtEnd';
import _t from 'i18n!nls/cml';
import { CmlContent } from 'bundles/cml/types/Content';
import 'css!./__styles__/FallbackEditor';

type Props = {
  cml?: CmlContent | null;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  isFocused?: boolean;
  placeholder?: string;
  onChange: (cml: CmlContent, html?: string) => void;
  elemRefHook?: (elem: HTMLTextAreaElement) => void;
};

type State = {
  plainText: string | boolean;
};

class FallbackEditor extends React.Component<Props, State> {
  editorElemRef: HTMLTextAreaElement | null;

  static defaultProps = {
    isFocused: false,
    placeholder: '',
    onChange: () => {},
  };

  constructor(props: Props) {
    super(props);
    const plainText = plainTextConverter.toPlainText(props.cml);
    this.state = { plainText };
    this.editorElemRef = null;
  }

  componentDidMount() {
    if (this.props.isFocused) {
      this.focus();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      plainText: plainTextConverter.toPlainText(nextProps.cml),
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isFocused && this.props.isFocused) {
      this.focus();
    }
  }

  emitChange = () => {
    const { cml, onChange } = this.props;
    const text = this.editorElemRef ? this.editorElemRef.value : '';
    onChange(plainTextConverter.toCML(text, CMLUtils.getDtdId(cml)));
  };

  focus() {
    placeCaretAtEnd(this.editorElemRef);
  }

  setEditorElemRef = (elem: HTMLTextAreaElement) => {
    this.editorElemRef = elem;
    if (typeof this.props.elemRefHook === 'function') {
      this.props.elemRefHook(elem);
    }
  };

  render() {
    const { id, ariaLabel, ariaDescribedBy } = this.props;
    const { plainText } = this.state;
    return (
      <div className="rc-FallbackEditor">
        <textarea
          id={id}
          value={typeof plainText === 'string' ? plainText : ''}
          onChange={this.emitChange}
          ref={this.setEditorElemRef}
          disabled={plainText === false}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        />
        {plainText === false && (
          <div className="lock-cover vertical-box align-items-absolute-center">
            <span>{_t('This browser does not support editing formatted content.')}</span>
            <span>{_t('Please use a supported browser.')}</span>
          </div>
        )}
      </div>
    );
  }
}

export default FallbackEditor;
