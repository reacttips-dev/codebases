import React, {Component} from 'react';
import {observer} from 'mobx-react';

import ActionModal from '../shared/action_modal.jsx';

export default
@observer
class ServiceCard extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.service = this.props.service;
    this.state = {
      initialPros: this.service.pros,
      initialCons: this.service.cons,
      pros: [],
      cons: [],
      proError: false,
      conError: false,
      proErrorMsg: '',
      conErrorMsg: '',
      confirmDelete: false,
      reasonIdToDelete: null,
      tooltipVisible: false,
      tooltipImage: '',
      tooltipUsername: '',
      proSubmitting: false,
      conSubmitting: false,
      prosFiltering: false,
      consFiltering: false,
      proCharCount: 55,
      conCharCount: 55
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({pros: this.state.initialPros, cons: this.state.initialCons});
  }

  updateCharLimit = (e, type) => {
    let charCount = e.target.value.length;
    let updatedCharCount = 55 - charCount;
    let obj = {};
    obj[`${type}CharCount`] = updatedCharCount;
    this.setState(obj);
  };

  throttleFiltering = (e, type) => {
    e.persist();
    this.updateCharLimit(e, type);
    this.toggleFiltering(e, type);
  };

  toggleFiltering = _.debounce((e, type) => {
    this.filterList(e, type);
  }, 250);

  filterList = (e, type) => {
    // Hide any error messages if they exist
    this.dismissError(type);
    // Determine pre-filtering item count
    let preFilteringCount = this.state[`${type}s`].length;
    // Filter the list for specified type
    let initialTypeKey = `initial${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    let updatedItems = this.state[initialTypeKey];
    updatedItems = updatedItems.filter(item => {
      return item.text.toLowerCase().search(e.target.value.toLowerCase()) !== -1;
    });
    let postFilteringCount = updatedItems.length;
    // If the new set of filtered items is different in size
    // than the pervious set we want to show the spinner, otherwise we don't
    let showSearchSpinner = postFilteringCount !== preFilteringCount ? true : false;
    // Set currently filtering flag
    let filteringFlagObj = {};
    let updatedStateObj = {};
    if (showSearchSpinner) {
      filteringFlagObj[`${type}sFiltering`] = true;
      this.setState(filteringFlagObj, () => {
        // Pause to show loading spinner before updating filtered list
        setTimeout(() => {
          // Set the filtered items
          updatedStateObj[`${type}s`] = updatedItems;
          // Set the filtering flag to false
          updatedStateObj[`${type}sFiltering`] = false;
          this.setState(updatedStateObj);
        }, 250);
      });
    }
  };

  toggleVote(reason) {
    this.store
      .toggleVote(reason)
      .then(() => {})
      .catch(() => null);
  }

  createReason = (e, type) => {
    e.preventDefault();
    let service = this.props.service;
    let reasonText = this.refs[`${type}-input`].value;
    if (reasonText === '') {
      // Don't allow submission of a blank reason, show the error message
      // Trigger showing error message in the UI
      let updatedState = this.state;
      // Set error flag to true
      updatedState[`${type}Error`] = true;
      // Set error message to display
      updatedState[`${type}ErrorMsg`] = `Enter some text!`;
      this.setState(updatedState);
    } else {
      // Disable the submit button while making the remote request
      let submittingObj = {};
      submittingObj[`${type}Submitting`] = true;
      this.setState(submittingObj);
      this.store
        .createReason(service, type, reasonText)
        .then(reason => {
          // Enable the submit button after completing the remote request
          submittingObj[`${type}Submitting`] = false;
          this.setState(submittingObj);
          // Clear the pro / con input field
          this.refs[`${type}-input`].value = '';
          // Reset the character limit
          let resetCharObj = {};
          resetCharObj[`${type}CharCount`] = 55;
          this.setState(resetCharObj);
          // Reset the filtered list
          // this.setState({pros: this.state.initialPros, cons: this.state.initialCons})
          // TODO: Refactor this with the same code in the filterList fn()
          let initialTypeKey = `initial${type.charAt(0).toUpperCase() + type.slice(1)}s`;
          let updatedItems = this.state[initialTypeKey];
          let updatedTypeKey = `${type}s`;
          let updatedItemsObj = {};
          updatedItemsObj[updatedTypeKey] = updatedItems;
          this.setState(updatedItemsObj);
          // Now scroll the reason element into view
          let reasonEl = document.getElementById(
            `service-${service.id}-${reason.type}-${reason.id}`
          );
          let topPos = reasonEl.offsetTop;
          document.getElementById(`service-${service.id}-${reason.type}-list`).scrollTop = topPos;
          this.store.animatePoints = true;
          setTimeout(() => {
            this.store.animatePoints = false;
          }, 750);
        })
        .catch(e => {
          // Enable the submit button after completing the remote request
          submittingObj[`${type}Submitting`] = false;
          this.setState(submittingObj);
          let errorMsg = e.responseJSON.error_msg;
          if (errorMsg === 'duplicate') {
            // Trigger showing error message in the UI
            let updatedState = this.state;
            // Set error flag to true
            updatedState[`${type}Error`] = true;
            // Set error message to display
            updatedState[`${type}ErrorMsg`] = `This ${type} already exists. Got anything else?`;
            this.setState(updatedState);
          }
        });
    }
  };

  scrollToNextCard = () => {
    let service = this.props.service;
    let currentCard = $(`#service-${service.id}`);
    let nextCard = currentCard.next();
    if (nextCard.length !== 0) {
      let nextCardTopOffset = nextCard.offset().top;
      let reasonsHeaderHeight = 68;
      let serviceCardTopMargin = 20;
      $('html, body').animate(
        {
          scrollTop: nextCardTopOffset - reasonsHeaderHeight - serviceCardTopMargin
        },
        200
      );
      trackEvent('pros_and_cons.click.nextTool', {
        currentTool: service.name
      });
    }
  };

  dismissError(type) {
    // Hide the error message in the UI
    let updatedState = this.state;
    updatedState[`${type}Error`] = false;
    this.setState(updatedState);
  }

  toggleConfirmDelete = id => {
    // If an id is passed in, set it as the reason id to delete
    // otherwise the value of id is "null" so we reset the reason id to delete
    this.setState({confirmDelete: !this.state.confirmDelete, reasonIdToDelete: id});
  };

  deleteReason = () => {
    this.store
      .deleteReason(this.state.reasonIdToDelete)
      .then(() => {
        // Close the delete modal after sucesfully deleting the pro / con
        this.toggleConfirmDelete();
        // Animate the change in points
        this.store.animatePoints = true;
        setTimeout(() => {
          this.store.animatePoints = false;
        }, 750);
      })
      .catch(() => null);
  };

  showTooltip = e => {
    // Set cloned tooltip content
    this.setState({tooltipVisible: true});
    let el = e.target;
    let tooltipContent = $(el)
      .next()
      .clone();
    let tooltipSelector = `#service-${this.service.id}-tooltip`;
    $(tooltipSelector).html(tooltipContent);
    let offset = $(el).offset();
    let width = $(el).width();
    let pageHeaderOffset = 68;
    // If an alert banner is present add its height to the pageHeaderOffset
    if ($('.alert').is(':visible')) {
      pageHeaderOffset = pageHeaderOffset + parseInt($('.alert').css('height'));
    }
    let sectionHeaderOffset = 68;
    let tooltipTopOffset = 20;
    let tooltipLeftOffset = 15;
    let containerMargin = parseInt($('.reasons_service_card_list').css('margin-left'));
    let top = offset.top - pageHeaderOffset - sectionHeaderOffset - tooltipTopOffset;
    let left = offset.left - containerMargin + width + tooltipLeftOffset;
    $(tooltipSelector).css({
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`
    });
    $(tooltipSelector)
      .find('.reasons_service_card__tooltip__content')
      .css('display', 'block');
  };

  hideTooltip = () => {
    this.setState({tooltipVisible: false});
  };

  render() {
    let service = this.props.service;

    let pros = this.state.pros.map(pro => {
      return (
        <li
          id={`service-${service.id}-pro-${pro.id}`}
          className="service_card__body__reason"
          key={`reason-${pro.id}`}
        >
          <div
            className={`service_card__body__reason__votes_container service_card__body__reason__votes_container--${
              pro.user_voted_for ? 'user_voted_for' : ''
            }`}
            onClick={() => this.toggleVote(pro)}
          >
            <div className="service_card__body__reason__votes_arrow" />
            <div className="service_card__body__reason__votes_count">{pro.votes}</div>
          </div>
          <div className="service_card__body__reason__description">
            <span onMouseEnter={e => this.showTooltip(e, pro)} onMouseLeave={this.hideTooltip}>
              {pro.text}
            </span>
            <div className="reasons_service_card__tooltip__content">
              <div className="reasons_service_card__tooltip__submitted_by">Submitted By</div>
              <div className="reasons_service_card__tooltip__inner_content">
                <img className="reasons_service_card__tooltip__avatar" src={pro.user_avatar} />
                <div className="reasons_service_card__tooltip__username">{pro.username}</div>
              </div>
              <div className="reasons_service_card__tooltip__triangle" />
            </div>
          </div>
          {window.app_data.current_user.id === pro.user_id && pro.votes <= 1 && (
            <a
              className="service_card__body__reason__delete"
              onClick={() => this.toggleConfirmDelete(pro.id)}
            >
              Delete
            </a>
          )}
        </li>
      );
    });

    let cons = this.state.cons.map(con => {
      return (
        <li
          id={`service-${service.id}-con-${con.id}`}
          className="service_card__body__reason"
          key={`reason-${con.id}`}
        >
          <div
            className={`service_card__body__reason__votes_container service_card__body__reason__votes_container--${
              con.user_voted_for ? 'user_voted_for' : ''
            }`}
            onClick={() => this.toggleVote(con)}
          >
            <div className="service_card__body__reason__votes_arrow" />
            <div className="service_card__body__reason__votes_count">{con.votes}</div>
          </div>
          <div className="service_card__body__reason__description">
            <span onMouseEnter={e => this.showTooltip(e, con)} onMouseLeave={this.hideTooltip}>
              {con.text}
            </span>
            <div className="reasons_service_card__tooltip__content">
              <div className="reasons_service_card__tooltip__submitted_by">Submitted By</div>
              <div className="reasons_service_card__tooltip__inner_content">
                <img className="reasons_service_card__tooltip__avatar" src={con.user_avatar} />
                <div className="reasons_service_card__tooltip__username">{con.username}</div>
              </div>
              <div className="reasons_service_card__tooltip__triangle" />
            </div>
          </div>
          {window.app_data.current_user.id === con.user_id && con.votes <= 1 && (
            <a
              className="service_card__body__reason__delete"
              onClick={() => this.toggleConfirmDelete(con.id)}
            >
              Delete
            </a>
          )}
        </li>
      );
    });

    return (
      <div id={`service-${service.id}`} className="service_card">
        <div className="service_card__header row">
          <div className="service_card__header__container col-md-12">
            <img className="service_card__header__logo" src={service.image_url} />
            <div className="service_card__header__details">
              <a className="service_card__header__name" href={service.canonical_url}>
                {service.name}
              </a>
              <div className="service_card__header__title">{service.title}</div>
            </div>
            <div
              className="service_card__header__next_tool_link btn-ss"
              onClick={this.scrollToNextCard}
            >
              <div className="service_card__header__next_tool_link_text">Next Tool</div>
              <div className="service_card__header__next_tool_link_icon">
                <span className="octicon octicon-chevron-down" />
              </div>
            </div>
          </div>
        </div>
        <div className="service_card__body row">
          <div
            className={`service_card__body__column ${
              this.store.showCons ? 'col-lg-6 col-md-6 col-sm-6' : 'col-lg-12 col-md-12 col-sm-12'
            }`}
          >
            <div className="service_card__body__column_header">
              Pros{' '}
              <span className="service_card__body__column_header_description">
                {' '}
                Why do you enjoy using {service.name}?
              </span>
            </div>
            <div className="service_card__body__column_divider" />
            <div className="service_card__body__column_body">
              {this.state.pros.length > 0 && !this.state.prosFiltering && (
                <ul
                  id={`service-${service.id}-pro-list`}
                  className="service_card__body__reasons_list service_card__body__reasons_list--pros"
                >
                  {pros}
                </ul>
              )}
              {this.state.pros.length > 0 && this.state.prosFiltering && (
                <div className="service_card__body__empty_list">
                  <img
                    className="service_card__body__filtering"
                    src="https://img.stackshare.io/fe/spinner.svg"
                  />
                </div>
              )}
              {this.state.initialPros.length === 0 && (
                <div className="service_card__body__empty_list">
                  <span>First! 🏆</span>
                </div>
              )}
              {this.state.pros.length === 0 && this.state.initialPros.length !== 0 && (
                <div className="service_card__body__empty_list" />
              )}
            </div>
            <div className="service_card__footer service_card__footer--pro">
              <div className="service_card__footer__column_divider" />
              <form
                className="service_card__footer__form"
                onSubmit={e => this.createReason(e, 'pro')}
              >
                <div
                  className={`service_card__footer__error_wrapper service_card__footer__error_wrapper--${
                    this.state.proError ? 'visible' : 'hidden'
                  }`}
                >
                  <div className="service_card__footer__error_box">
                    <i
                      className="service_card__footer__error_close octicon octicon-x"
                      onClick={() => this.dismissError('pro')}
                    />
                    {this.state.proErrorMsg}
                  </div>
                  <div className="service_card__footer__error_triangle" />
                </div>
                <input
                  ref="pro-input"
                  maxLength="55"
                  className={`service_card__footer__input ${
                    this.store.showCons
                      ? 'col-lg-8 col-md-8 col-sm-8 col-xs-7'
                      : 'col-lg-10 col-md-10 col-sm-10 col-xs-10'
                  }`}
                  type="text"
                  onChange={e => this.throttleFiltering(e, 'pro')}
                />
                <div className="service_card__footer__char_limit">{this.state.proCharCount}</div>
                <button
                  disabled={this.state.proSubmitting}
                  className="service_card__footer__btn btn btn-ss-alt col-lg-2 col-md-2 col-sm-2 col-xs-2"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          {this.store.showCons && (
            <div className="service_card__body__column col-lg-6 col-md-6 col-sm-6">
              <div className="service_card__body__column_header">
                Cons{' '}
                <span className="service_card__body__column_header_description">
                  {' '}
                  What are the downsides of using {service.name}?
                </span>
              </div>
              <div className="service_card__body__column_divider" />
              <div className="service_card__body__column_body">
                {this.state.cons.length > 0 && !this.state.consFiltering && (
                  <ul
                    id={`service-${service.id}-con-list`}
                    className="service_card__body__reasons_list service_card__body__reasons_list--cons"
                  >
                    {cons}
                  </ul>
                )}
                {this.state.cons.length > 0 && this.state.consFiltering && (
                  <div className="service_card__body__empty_list">
                    <img
                      className="service_card__body__filtering"
                      src="https://img.stackshare.io/fe/spinner.svg"
                    />
                  </div>
                )}
                {this.state.initialCons.length === 0 && (
                  <div className="service_card__body__empty_list">
                    <span>First! 🏆</span>
                  </div>
                )}
                {this.state.cons.length === 0 && this.state.initialCons.length !== 0 && (
                  <div className="service_card__body__empty_list" />
                )}
              </div>
              <div className="service_card__footer service_card__footer--con">
                <div className="service_card__footer__column_divider" />
                <form
                  className="service_card__footer__form"
                  onSubmit={e => this.createReason(e, 'con')}
                >
                  <div
                    className={`service_card__footer__error_wrapper service_card__footer__error_wrapper--${
                      this.state.conError ? 'visible' : 'hidden'
                    }`}
                  >
                    <div className="service_card__footer__error_box">
                      <i
                        className="service_card__footer__error_close octicon octicon-x"
                        onClick={() => this.dismissError('con')}
                      />
                      {this.state.conErrorMsg}
                    </div>
                    <div className="service_card__footer__error_triangle" />
                  </div>
                  <input
                    ref="con-input"
                    maxLength="55"
                    className="service_card__footer__input col-lg-8 col-md-8 col-sm-8 col-xs-7"
                    type="text"
                    onChange={e => this.throttleFiltering(e, 'con')}
                  />
                  <div className="service_card__footer__char_limit">{this.state.conCharCount}</div>
                  <button
                    disabled={this.state.conSubmitting}
                    className="service_card__footer__btn btn btn-ss-alt col-lg-2 col-md-2 col-sm-2 col-xs-2"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        {this.state.confirmDelete && (
          <ActionModal
            cancelFn={() => this.toggleConfirmDelete(null)}
            successFn={this.deleteReason}
            content="Are you sure you want to delete this?"
          />
        )}
        <div
          id={`service-${service.id}-tooltip`}
          className={`reasons_service_card__tooltip reasons_service_card__tooltip--${
            this.state.tooltipVisible ? 'visible' : 'hidden'
          }`}
        />
      </div>
    );
  }
}
