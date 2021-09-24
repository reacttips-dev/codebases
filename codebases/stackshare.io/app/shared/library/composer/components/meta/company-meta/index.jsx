import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import CompanySearch from './search';
import Meta from '../meta';
import {withSendAnalyticsEvent} from '../../../../../enhancers/analytics-enhancer';
import {COMPOSER_CHOOSE_COMPANY, COMPOSER_CLEAR_COMPANY} from '../../../../../constants/analytics';
import {companyPresenter} from '../../../utils';
import DefaultCompanyIcon from '../../../../icons/default-company-icon.svg';
import CompanyIcon from '../../../../icons/chips/company.svg';

const Container = glamorous.div({
  position: 'relative',
  flex: 1
});

export class CompanyMeta extends Component {
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

  componentDidMount() {
    if (this.props.company) this.props.onChange({...this.props.company, ignoreDirty: true});
  }

  container = createRef();

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
    if (this.container.current && !this.container.current.contains(event.target)) {
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
        COMPOSER_CHOOSE_COMPANY,
        companyPresenter('taggedCompany', company)
      );
    } else {
      this.props.sendAnalyticsEvent(
        COMPOSER_CLEAR_COMPANY,
        companyPresenter('taggedCompany', this.props.company)
      );
    }
    this.props.onChange(company);
  };

  render() {
    const {company, myCompanies, disabled} = this.props;
    const {active} = this.state;

    return (
      <Container innerRef={this.container}>
        {company ? (
          <Meta
            icon={company.imageUrl || <DefaultCompanyIcon />}
            label={company.name}
            onClick={this.toggleActive}
            onDelete={this.handleChange}
            cancelAble={!disabled}
          />
        ) : (
          <Meta
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

export default withSendAnalyticsEvent(CompanyMeta);
