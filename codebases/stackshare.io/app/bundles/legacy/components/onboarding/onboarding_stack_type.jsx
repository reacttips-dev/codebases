import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';
import * as C from './constants';

@observer
class OnboardingStackType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partOfAnyPrivateCompany: true,
      companiesFetched: false
    };
  }

  setStackOwner(owner) {
    trackEvent('stack.create.stackType.submit', {
      value: owner === 'personal' ? 'personal' : 'business'
    });

    this.context.globalStore.stackOwner = owner;
    browserHistory.push(`${C.ONBOARDING_BASE_PATH}/stack-info`);
  }

  componentDidMount() {
    $.get('/api/v1/companies/index', response => {
      this.context.globalStore.companies = [];
      this.setState({partOfAnyPrivateCompany: response.some(value => value.private_mode)});
      response.forEach(value => {
        value.type = 'company';
        this.context.globalStore.addCompany(value);
      });
      this.setState({companiesFetched: true});
    });
    this.context.navStore.backRoute = `${C.ONBOARDING_BASE_PATH}/scan`;
  }

  companyImgPath(company) {
    return company.image_url || C.IMG_NO_IMG;
  }

  toNewCompanyPage() {
    trackEvent('stack.create.stackType.submit', {value: 'newCompany'});
    browserHistory.push(`${C.ONBOARDING_BASE_PATH}/new-company`);
  }

  render() {
    const {partOfAnyPrivateCompany} = this.state;

    return (
      <div className="onboarding__stack-type">
        {(this.context.routerProps.isAdmin || !partOfAnyPrivateCompany) && (
          <div className="onboarding__stack-type__tile new-company" onClick={this.toNewCompanyPage}>
            <div className="onboarding__stack-type__tile--horiz">
              <img src={C.IMG_NEW_COMPANY} />
              <h3>New Company</h3>
            </div>
          </div>
        )}
        <div
          className="onboarding__stack-type__tile"
          onClick={() => this.setStackOwner('personal')}
        >
          <div className="onboarding__stack-type__tile--horiz personal">
            <img src={this.context.routerProps.userImg} />
            <h3>Personal</h3>
          </div>
        </div>
        {!this.state.companiesFetched && (
          <div className="onboarding__stack-type__tile">
            <div className="onboarding__stack-type__tile--horiz loading">
              <h3>Fetching Companies</h3>
            </div>
          </div>
        )}
        {this.context.globalStore.companies.map(company => {
          return (
            <div
              key={company.id}
              className="onboarding__stack-type__tile"
              onClick={() => this.setStackOwner(company.id)}
            >
              <div className="onboarding__stack-type__tile--horiz">
                <img src={this.companyImgPath(company)} />
                <h3>Company</h3>
                <p>{company.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

OnboardingStackType.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};

export default OnboardingStackType;
