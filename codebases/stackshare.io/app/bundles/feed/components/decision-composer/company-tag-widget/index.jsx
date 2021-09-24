import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import CompanySearch from './search';
import Chip from '../chip';
import {withSendAnalyticsEvent} from '../../../../../shared/enhancers/analytics-enhancer';
import {
  FEED_CHOOSE_COMPOSER_COMPANY,
  FEED_CLEAR_COMPOSER_COMPANY
} from '../../../constants/analytics';
import {companyPresenter} from '../index';
import DefaultCompanyIcon from '../../icons/default-company-icon.svg';
import CompanyIcon from '../icons/company-icon.svg';

const Container = glamorous.div({
  position: 'relative',
  flex: 1,
  top: -1
});

export class CompanyTagWidget extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    company: PropTypes.object,
    myCompanies: PropTypes.array,
    disabled: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func
  };

  state = {
    active: false
  };

  container = null;
  assignContainer = el => (this.container = el);

  toggleActive = () => {
    if (this.props.disabled) {
      return;
    }
    // if about to activate, add event listener so we can deactivate on document click
    if (!this.state.active) {
      document.addEventListener('click', this.handleBlur, {capture: true, once: true});
    }
    this.setState({active: !this.state.active});
  };

  handleBlur = event => {
    if (!this.container.contains(event.target)) {
      this.toggleActive();
    }
  };

  handleChange = company => {
    if (this.props.disabled) {
      return;
    }
    this.setState({active: false});
    if (company) {
      this.props.sendAnalyticsEvent(
        FEED_CHOOSE_COMPOSER_COMPANY,
        companyPresenter('taggedCompany', company)
      );
    } else {
      this.props.sendAnalyticsEvent(
        FEED_CLEAR_COMPOSER_COMPANY,
        companyPresenter('taggedCompany', this.props.company)
      );
    }
    this.props.onChange(company);
  };

  render() {
    const {company, myCompanies, disabled} = this.props;
    const {active} = this.state;

    return (
      <Container innerRef={this.assignContainer}>
        {company ? (
          <Chip
            icon={company.imageUrl || <DefaultCompanyIcon />}
            label={company.name}
            onClick={this.toggleActive}
            onDelete={this.handleChange}
          />
        ) : (
          <Chip
            icon={<CompanyIcon />}
            label="Tag your company"
            onClick={this.toggleActive}
            placeholder={true}
          />
        )}
        {active && !disabled && (
          <CompanySearch onChoose={this.handleChange} myCompanies={myCompanies} />
        )}
      </Container>
    );
  }
}

export default withSendAnalyticsEvent(CompanyTagWidget);
