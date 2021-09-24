import React, {Component} from 'react';
import SimpleButton from '../../../../shared/library/buttons/base/simple';

export default class IUseThis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stacks: null,
      serviceId: null
    };
    this._iUseThisButton = null;
  }

  downloadStacks() {
    this.serverRequest = $.get('/stacks/i_use_this/' + this.props.serviceId, result => {
      this.setState({stacks: result, serviceId: this.props.serviceId});
      this.initializeDrop();
    });
  }

  // This generates the content used in the Drop popup.
  popupContent() {
    let content = '';
    content +=
      "<div class='i-use-this-content'>" +
      "<div style='padding: 15px 5px 15px 5px;'>" +
      "<div style='color: white;'> Add this tool to your stack" +
      "<hr style='border-color: rgb(90,90,90);' />";

    // Render the company stacks, if any.
    if (this.state.stacks && this.state.stacks.companyStacks) {
      content += this.state.stacks.companyStacks.length > 0 ? '<h4>Company Stacks</h4>' : '';

      // If the user has no company, show the default Add New Company button.
      if (this.state.stacks.companyStacks.length === 0) {
        content += this.renderDefaultMyCompanyStack();
      }

      let companyStacks = '';
      for (let i = 0; i < this.state.stacks.companyStacks.length; i++) {
        companyStacks += this.renderStack(this.state.stacks.companyStacks[i]);
      }
      content += companyStacks;
    }

    // Render the personal stacks, if any.
    content += '<br><h4>Personal Stacks</h4>';

    if (this.state.stacks && this.state.stacks.personalStacks) {
      // If the user has no personal stacks, show a default My Stack button.
      if (this.state.stacks.personalStacks.length === 0) {
        content += this.renderDefaultMyStack();
      }
      let personalStacks = '';
      for (let i = 0; i < this.state.stacks.personalStacks.length; i++) {
        personalStacks += this.renderStack(this.state.stacks.personalStacks[i]);
      }
      content += personalStacks;
      content += '</div></div></div>';
    }

    return content;
  }

  // This renders the stack list item.
  renderDefaultMyStack() {
    return (
      "<div style='margin: 6px 0; overflow: hidden;'>" +
      "<button style='float: left;margin-right:7px' data-service-id='" +
      this.state.serviceId +
      "' class='btn btn-sm btn-ss-alt add-service-to-default-stack'>" +
      'Add' +
      '</button>' +
      "<span style='float: left;margin-top:2px;margin-left: 4px;'>" +
      "<div id='pop-stack'>" +
      "<div style='font-weight: bold;font-size:14px'>" +
      'My Stack' +
      '</div>' +
      '</div>' +
      '</span>' +
      '</div>'
    );
  }

  // This renders the stack list item.
  renderDefaultMyCompanyStack() {
    return (
      "<div style='margin: 6px 0; overflow: hidden;'>" +
      "<div class='btn btn-sm btn-ss-alt' style='margin-right:4px;font-style:italics'>" +
      "<a href='/create-stack/scan' style='color:white' target='_blank'>Add New Company</a>" +
      '</div>' +
      '</div>'
    );
  }

  // This renders the stack list item.
  renderStack(stack) {
    return (
      "<div style='margin: 6px 0; overflow: hidden;'>" +
      "<button style='float: left;margin-right:7px' data-service-id='" +
      this.state.serviceId +
      "' data-stack-id='" +
      stack.id +
      "' class='btn btn-sm btn-ss-alt add-service-to-stack " +
      (stack.added ? 'disabled' : '') +
      "'>" +
      (stack.added ? 'Added' : 'Add') +
      '</button>' +
      "<span style='float: left;margin-top:2px;margin-left: 4px;'>" +
      "<div id='pop-stack'>" +
      "<a href='" +
      stack.canonical_url +
      "' target='_blank'>" +
      stack.name +
      '</a>' +
      '</div>' +
      '</span>' +
      '</div>'
    );
  }

  componentDidMount() {
    this.downloadStacks();
    $('.iUseThisButtonPlaceholder').remove();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  // When the user clicks the I Use This button.
  handleClick = e => {
    e.preventDefault();
    if (this.props.currentUser) {
      trackEvent('i_use_this.clicked', {service: this.props.serviceId});
    } else {
      signupModal();
    }
  };

  // Initializes the Drop popup and sets it under the I Use This button.
  initializeDrop() {
    if (!this.props.currentUser) return;
    const drop = new Drop({
      target: this._iUseThisButton,
      openOn: 'click',
      classes: 'drop-theme-arrows-bounce-dark',
      constrainToWindow: false,
      constrainToScrollParent: false,
      position: 'bottom center',
      content: () => this.popupContent()
    });
    drop.on('close', () => this.downloadStacks());
  }

  render() {
    return (
      <div
        ref={el => (this._iUseThisButton = el)}
        style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}
      >
        <SimpleButton width={125} onClick={this.handleClick}>
          <span>I Use This</span>
        </SimpleButton>
      </div>
    );
  }
}
