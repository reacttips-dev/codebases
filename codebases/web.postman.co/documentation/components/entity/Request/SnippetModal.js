import React from 'react';

import { Modal, ModalContent, ModalHeader } from '../../../../js/components/base/Modals';
import { formatSnippet } from '../../../utils/snippet';
import EnhancedCode from '../../core/EnhancedCode';

export default class SnippetModal extends React.Component {
  state = {
    isOpen: false,
    title: null,
    content: null,
    language: null,
    variant: null,
    type: null,
    showLabel: true
  }

  componentDidMount () {
    pm.mediator.on('openSnippetsModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openSnippetsModal', this.handleRequestClose);
    this.timeout && clearTimeout(this.timeout);
  }

  handleOpen = (data) => {
    this.setState({
      isOpen: true,
      title: data.name,
      content: formatSnippet(data.body, data.language),
      language: data.language,
      variant: data.variant,
      syntaxMode: data.syntaxMode,
      type: data.type,
      showLabel: data.showLabel,
      selectedLanguage: data.selectedLanguage && data.selectedLanguage
    });
  }

  handleRequestClose = () => {
    this.setState({ isOpen: false });
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        className='snippet-modal'
        onRequestClose={this.handleRequestClose}
        customStyles={{
          marginTop: '17vh',
          minWidth: '720px',
          maxHeight: '70vh',
          width: '55vw'
        }}
      >
        {this.state.title ? <ModalHeader>{this.state.title}</ModalHeader> : null}
        {this.state.content
          ? (
            <ModalContent>
              <EnhancedCode
                body={this.state.content}
                language={this.state.language}
                selectedLanguage={this.state.selectedLanguage}
                syntaxMode={this.state.syntaxMode}
                variant={this.state.variant}
                showLabel={this.state.showLabel}
                enableClickToExpand={false}
                className='highlighted-code--snippet-modal'
                highlightSyntaxByDefault
              />
            </ModalContent>
          )
          : null}
      </Modal>
    );
  }
}
